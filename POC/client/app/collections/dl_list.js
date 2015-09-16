
var Dl = require('../models/dl')

module.exports =  Backbone.Collection.extend({
    model: Dl,
    url: 'dl',
})
