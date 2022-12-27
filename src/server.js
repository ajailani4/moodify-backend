const Hapi = require('@hapi/hapi');
const mongoDB = require('hapi-mongodb');
const dotenv = require('dotenv');

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

  await server.start();

  console.log(`Server running on ${server.info.uri}`);
};

init();
