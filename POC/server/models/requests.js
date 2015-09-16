/* See documentation on
 https://github.com/cozy/cozy-db */

var cozydb = require('cozydb');

module.exports = {
  dl: {
    // shortcut for emit doc._id, doc
    all: cozydb.defaultRequests.all
    }
};
