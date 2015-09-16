// See documentation on https://github.com/frankrousseau/americano#routes

var dl = require('./dl');

module.exports = {
  'dl': {
    get: dl.fetch,
    post: dl.create
  }
};

