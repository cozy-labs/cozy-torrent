
var BaseView = require('./view');

var DlRowView = BaseView.extend({
    template: require('./templates/dl_row'),

    className: 'dl-row',
    tagName: 'tr',

    initialize: function (attributes) {
        this.model = attributes.model

        console.log('dl row view init: ', this)
    },

    getRenderData: function () {
        return {model: this.model.toJSON()}
    }

})

module.exports = DlRowView
