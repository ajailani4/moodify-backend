const prefix = '/api/v1';

const { register } = require('./handler/user-handler');

const routes = [
  // Register
  {
    method: 'POST',
    path: `${prefix}/register`,
    options: { auth: false },
    handler: register,
  },
];

module.exports = routes;
