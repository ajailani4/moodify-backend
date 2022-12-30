const { StatisticType } = require('../util/statistic-type');

const getStatistic = async (request, h) => {
  const { username } = request.auth.credentials;
  const { type } = request.query;
  let response = '';

  try {
    const moods = await request.mongo.db.collection('moods')
      .find({ username })
      .toArray();

    if (type === StatisticType.MoodPercentage) {
      const moodCount = moods.length;

      if (moodCount > 0) {
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
      }

      response = h.response({
        code: 404,
        status: 'Not Found',
        message: 'No data',
      });

      response.code(404);

      return response;
    }
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
