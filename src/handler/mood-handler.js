const addMood = async (request, h) => {
  const {
    mood,
    activityName,
    note,
    date,
    time,
  } = request.payload;
  const { username } = request.auth.credentials;

  let response = '';

  try {
    await request.mongo.db.collection('moods')
      .insertOne({
        username,
        mood,
        activity_name: activityName,
        note,
        date,
        time,
      });

    response = h.response({
      code: 201,
      status: 'Created',
      message: 'New mood has been added',
    });

    response.code(201);

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

module.exports = { addMood };
