
var View = require('./view');
var template = require('./templates/home');
var DlCollection = require('../collections/dl_list')
var app = require('../application')

var HomeView = View.extend({
    id: 'home-view',
    template: template,

    events: {
        'click button#menu-add-magnet': 'createNewDl',
    },

    createNewDl: function () {
        var magnet = this.$('input#magnet-input').val()

        app.listDl.create({'magnet': magnet}, {
            error: function (error) {
                console.error(error)
            },
            success: function (data) {
                console.log('data: ', app.listDl.models)
            }
        })
    }



});

module.exports = HomeView
