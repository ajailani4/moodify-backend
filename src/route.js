const prefix = '/api/v1';

const { register, login } = require('./handler/user-handler');
const { addMood, getMoods } = require('./handler/mood-handler');

const routes = [
  // Register
  {
    method: 'POST',
    path: `${prefix}/register`,
    options: { auth: false },
    handler: register,
  },
  // Login
  {
    method: 'POST',
    path: `${prefix}/login`,
    options: { auth: false },
    handler: login,
  },
  // Add Mood
  {
    method: 'POST',
    path: `${prefix}/moods`,
    options: { auth: 'jwt' },
    handler: addMood,
  },
  // Get Moods
  {
    method: 'GET',
    path: `${prefix}/moods`,
    options: { auth: 'jwt' },
    handler: getMoods,
  },
];

module.exports = routes;
