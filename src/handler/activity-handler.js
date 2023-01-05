const axios = require('axios').default;

const getActivityIcon = async (request, activityName) => {
  const activity = await request.mongo.db.collection('activities').findOne({ activity_name: activityName });

  return activity.icon;
};

const getActivities = async (request, h) => {
  const { username } = request.auth.credentials;
  const { recommended } = request.query;
  let response = '';

  try {
    if (recommended === 'true') {
      // Retrieve activity candidates
      const retrievalRes = await axios.post(
        `${process.env.MODEL_BASE_URL}/v1/models/activities_retrieval:predict`,
        {
          instances: [`${username}`],
        },
      );

      const activityCandidates = retrievalRes.data.predictions[0].output_2;

      // Rank the retrieved activity candidates
      const rankingQuery = activityCandidates.map((activity) => ({
        username,
        activity_name: activity,
      }));

      const rankingRes = await axios.post(
        `${process.env.MODEL_BASE_URL}/v1/models/activities_ranking:predict`,
        {
          instances: rankingQuery,
        },
      );

      const activitiesScores = rankingRes.data.predictions;
      const rankedActivities = activityCandidates.map(async (activity, index) => ({
        activityName: activity,
        icon: await getActivityIcon(request, activity),
        scores: activitiesScores[index][0],
      })).sort(
        (a, b) => b.scores - a.scores,
      );

      response = h.response({
        code: 200,
        status: 'OK',
        data: await Promise.all(rankedActivities),
      });

      response.code(200);

      return response;
    }

    const activities = await request.mongo.db.collection('activities').find().toArray();

    response = h.response({
      code: 200,
      status: 'OK',
      data: activities.map((activity) => ({
        id: activity._id,
        activityName: activity.activity_name,
      })),
    });

    response.code(200);

    return response;
  } catch (e) {
    response = h.response({
      code: 400,
      status: 'Bad Request',
      message: 'error',
    });

    response.code(400);
  }

  return response;
};

module.exports = { getActivities };
