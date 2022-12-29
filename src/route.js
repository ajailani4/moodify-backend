const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const prefix = '/api/v1';

const { register, login } = require('./handler/user-handler');
const {
  addMood,
  getMoods,
  getMoodDetail,
  editMood,
  deleteMood,
} = require('./handler/mood-handler');

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
];

module.exports = routes;
