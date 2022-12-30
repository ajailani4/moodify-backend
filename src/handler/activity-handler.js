const getActivities = async (request, h) => {
  let response = '';

  try {
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
