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

const getMoods = async (request, h) => {
  const { username } = request.auth.credentials;
  let { page, size } = request.query;

  let response = '';

  try {
    page = Number(page) || 1;
    size = Number(size) || 10;

    const moods = await request.mongo.db.collection('moods')
      .find({ username })
      .skip((page - 1) * size)
      .limit(size)
      .toArray();

    response = h.response({
      code: 200,
      status: 'OK',
      data: moods.map((mood) => ({
        id: mood._id,
        mood: mood.mood,
        activityName: mood.activity_name,
        date: mood.date,
        time: mood.time,
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

const getMoodDetail = async (request, h) => {
  const { id } = request.params;
  const { ObjectID } = request.mongo;
  let response = '';

  try {
    const mood = await request.mongo.db.collection('moods').findOne({ _id: ObjectID(id) });

    if (!mood) {
      response = h.response({
        code: 404,
        status: 'Not Found',
        message: 'Mood is not found',
      });

      response.code(404);

      return response;
    }

    response = h.response({
      code: 200,
      status: 'OK',
      data: {
        id: mood._id,
        mood: mood.mood,
        activityName: mood.activity_name,
        note: mood.note,
        date: mood.date,
        time: mood.time,
      },
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

module.exports = { addMood, getMoods, getMoodDetail };
