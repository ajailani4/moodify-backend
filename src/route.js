const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const prefix = '/api/v1';

const { register, login, getProfile } = require('./handler/user-handler');
const {
  addMood,
  getMoods,
  getMoodDetail,
  editMood,
  deleteMood,
} = require('./handler/mood-handler');
const { getActivities } = require('./handler/activity-handler');
const { getStatistic } = require('./handler/statistic-handler');

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

  // Get Mood Detail
  {
    method: 'GET',
    path: `${prefix}/moods/{id}`,
    options: {
      auth: 'jwt',
      validate: {
        params: Joi.object({
          id: Joi.objectId(),
        }),
      },
    },
    handler: getMoodDetail,
  },
  // Edit Mood
  {
    method: 'PUT',
    path: `${prefix}/moods/{id}`,
    options: {
      auth: 'jwt',
      validate: {
        params: Joi.object({
          id: Joi.objectId(),
        }),
      },
    },
    handler: editMood,
  },
  // Delete Mood
  {
    method: 'DELETE',
    path: `${prefix}/moods/{id}`,
    options: {
      auth: 'jwt',
      validate: {
        params: Joi.object({
          id: Joi.objectId(),
        }),
      },
    },
    handler: deleteMood,
  },
  // Get Activities
  {
    method: 'GET',
    path: `${prefix}/activities`,
    options: { auth: 'jwt' },
    handler: getActivities,
  },
  // Get Statistic
  {
    method: 'GET',
    path: `${prefix}/statistics`,
    options: { auth: 'jwt' },
    handler: getStatistic,
  },
  // Get Profile
  {
    method: 'GET',
    path: `${prefix}/profile`,
    options: { auth: 'jwt' },
    handler: getProfile,
  },
];

module.exports = routes;
