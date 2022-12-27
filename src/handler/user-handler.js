const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateJwt } = require('../util/jwt-util');

const saltRounds = 10;

const register = async (request, h) => {
  const {
    username,
    password,
    name,
    email,
  } = request.payload;
  let response = '';

  try {
    // Check if already exists
    const user = await request.mongo.db.collection('users').findOne({ username });

    if (user) {
      response = h.response({
        code: 409,
        status: 'Conflict',
        message: 'Username already exists. Try another username',
      });

      response.code(409);

      return response;
    }

    // Insert a new user
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await request.mongo.db.collection('users')
      .insertOne({
        name,
        email,
        username,
        password: hashedPassword,
      });

    response = h.response({
      code: 201,
      status: 'Created',
      data: {
        username,
        accessToken: generateJwt(jwt, username),
      },
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

module.exports = { register };
