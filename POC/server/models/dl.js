
var cozydb = require('cozydb');

var TemplateModel = cozydb.getModel('Template', {
  title: String,
  date: Date,
  length: Number
});

module.exports = TemplateModel;
