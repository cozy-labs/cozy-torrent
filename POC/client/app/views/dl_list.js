

var ViewCollection = require('../lib/view_collection')
var DlRowView = require('./dl_row')

var DlListView = ViewCollection.extend({
    template:  require('./templates/dl_list'),
    el: '#dl-content',

    itemView: DlRowView,
    collectionEl: 'tbody#table-items-content',

    initialize: function (options) {
        this.collection = options.collection
        DlListView.__super__.initialize.call(this)
    }

})


module.exports = DlListView
