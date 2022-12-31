const { StatisticType } = require('../util/statistic-type');

const getStatistic = async (request, h) => {
  const { username } = request.auth.credentials;
  const { type } = request.query;
  let response = '';

  try {
    const moods = await request.mongo.db.collection('moods')
      .find({ username })
      .toArray();

    const moodCount = moods.length;

    if (moodCount > 0) {
      if (type === StatisticType.MoodPercentage) {
        const excellentMoodCount = moods.filter((mood) => mood.mood === 5).length;
        const goodMoodCount = moods.filter((mood) => mood.mood === 4).length;
        const okayMoodCount = moods.filter((mood) => mood.mood === 3).length;
        const badMoodCount = moods.filter((mood) => mood.mood === 2).length;
        const terribleMoodCount = moods.filter((mood) => mood.mood === 1).length;

        response = h.response({
          code: 200,
          status: 'OK',
          data: {
            excellent: Number(((excellentMoodCount / moodCount) * 100).toFixed(1)),
            good: Number(((goodMoodCount / moodCount) * 100).toFixed(1)),
            okay: Number(((okayMoodCount / moodCount) * 100).toFixed(1)),
            bad: Number(((badMoodCount / moodCount) * 100).toFixed(1)),
            terrible: Number(((terribleMoodCount / moodCount) * 100).toFixed(1)),
          },
        });

        response.code(200);

        return response;
      } if (type === StatisticType.FrequentActivities) {
        const moodsDatasetItems = await request.mongo.db.collection('moods_dataset')
          .find({ username })
          .toArray();

        const activities = moodsDatasetItems.map(
          (moodDatasetItem) => moodDatasetItem.activity_name,
        );

        const eachActivitiesCount = activities.map((activity) => ({
          activity,
          count: moods.filter((mood) => mood.activity_name === activity).length,
        })).sort(
          (a, b) => b.count - a.count,
        );

        response = h.response({
          code: 200,
          status: 'OK',
          data: eachActivitiesCount,
        });

        response.code(200);

        return response;
      }
    }

    response = h.response({
      code: 404,
      status: 'Not Found',
      message: 'No data',
    });

    response.code(404);

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

module.exports = { getStatistic };
