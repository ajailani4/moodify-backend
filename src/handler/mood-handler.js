const addAndUpdateMoodToDataset = async (db, username, mood, activityName) => {
  try {
    const moodDatasetItem = await db.collection('moods_dataset').findOne(
      {
        username,
        activity_name: activityName,
      },
    );

    if (!moodDatasetItem) {
      await db.collection('moods_dataset')
        .insertOne({
          username,
          mood,
          activity_name: activityName,
        });
    } else {
      await db.collection('moods_dataset')
        .updateOne(
          { _id: moodDatasetItem._id },
          {
            $set: {
              username,
              mood,
              activity_name: activityName,
            },
          },
        );
    }
  } catch (e) {
    console.log(e);
  }
};

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

    await addAndUpdateMoodToDataset(request.mongo.db, username, mood, activityName);

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
  const { month, year } = request.query;
  let response = '';
  let moods = '';

  try {
    page = Number(page) || 1;
    size = Number(size) || 10;

    moods = await request.mongo.db.collection('moods')
      .find({ username })
      .sort({ date: -1, time: -1 })
      .skip((page - 1) * size)
      .limit(size)
      .toArray();

    if (month && year) {
      moods = moods.filter((mood) => {
        const date = new Date(mood.date);
        return date.getMonth() === Number(month) - 1 && date.getFullYear() === Number(year);
      });
    }

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

const editMood = async (request, h) => {
  const { id } = request.params;
  const {
    mood,
    activityName,
    note,
    date,
    time,
  } = request.payload;
  const { ObjectID } = request.mongo;
  let response = '';

  try {
    const moodObj = await request.mongo.db.collection('moods').findOne({ _id: ObjectID(id) });

    if (!moodObj) {
      response = h.response({
        code: 404,
        status: 'Not Found',
        message: 'Mood is not found',
      });

      response.code(404);

      return response;
    }

    await request.mongo.db.collection('moods')
      .updateOne(
        { _id: ObjectID(id) },
        {
          $set: {
            mood,
            activity_name: activityName,
            note,
            date,
            time,
          },
        },
      );

    response = h.response({
      code: 200,
      status: 'OK',
      message: 'Mood has been updated',
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

const deleteMood = async (request, h) => {
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

    await request.mongo.db.collection('moods').deleteOne({ _id: ObjectID(id) });

    response = h.response({
      code: 200,
      status: 'OK',
      message: 'Mood has been deleted',
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

module.exports = {
  addMood,
  getMoods,
  getMoodDetail,
  editMood,
  deleteMood,
};
