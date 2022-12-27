const Hapi = require('@hapi/hapi');
const mongoDB = require('hapi-mongodb');
const dotenv = require('dotenv');
const hapiAuthJwt = require('hapi-auth-jwt2');
const routes = require('./route');
const { validateJwt } = require('./util/jwt-util');

const init = async () => {
  dotenv.config();

  const server = Hapi.server({
    port: process.env.PORT || 80,
    host: process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // Configure MongoDB
  await server.register({
    plugin: mongoDB,
    options: {
      url: process.env.MONGODB_URI,
      settings: {
        useUnifiedTopology: true,
      },
      decorate: true,
    },
  });

  // Configure JWT
  await server.register(hapiAuthJwt);

  server.auth.strategy(
    'jwt',
    'jwt',
    {
      key: process.env.JWT_SECRET,
      validate: validateJwt,
      verifyOptions: { ignoreExpiration: true },
    },
  );

  await server.route(routes);
  await server.start();

  console.log(`Server running on ${server.info.uri}`);
};

init();
