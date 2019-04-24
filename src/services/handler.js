const registry = require('../services/registry.js');
const { Handler } = require('patron.js');
const handler = new Handler({ registry });

module.exports = handler;
