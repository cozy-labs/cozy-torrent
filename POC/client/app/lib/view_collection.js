
var BaseView = require('../views/view')

var ViewCollection = BaseView.extend({
    itemView: null,
    views: {},
    collectionEl: null,

    appendView: function (view) {
        console.log('view appended : ', view)
        console.log('collection El: ', this.$collectionEl)
        this.$collectionEl.append(view.el)
    },

    initialize: function () {
        ViewCollection.__super__.initialize.call(this)
        this.views = {}
        this.listenTo(this.collection, 'reset', this.onReset)
        this.listenTo(this.collection, 'add', this.addItem)
        this.listenTo(this.collection, 'remove', this.removeItem)

        if (this.collectionEl == null || undefined) {
            collectionEl = el
        }
    },

    render: function () {
        for (id in this.views) {
            this.views[id].$el.detach()
        }
        ViewCollection.__super__.render.call(this)
    },

    afterRender: function () {
        console.log('after render')
        this.$collectionEl = $(this.collectionEl)
        console.log('el: ', this.$collectionEl)
        for (id in this.views) {
            console.log('el in for: ', this.$collectionEl)
            this.appendView(this.views[id])
        }
        this.onReset(this.collection)
    },

    remove: function () {
        this.onReset()
        ViewCollection.__super__.remove.call(this)
    },

    onReset: function (newCollection) {
        for (id in this.views) {
            view.remove()
        }
        newCollection.forEach(this.addItem)
    },

    addItem: function (model) {
        console.log('add item view: model -> ', model)
        view = new this.itemView({model: model})
        console.log('new view created: ', view)
        this.views[model.cid] = view.render()
        console.log('add -> list views: ', this.views)
        this.appendView(view)
    },


    removeItem: function (model) {
        this.views[model.cid].remove()
        delete this.views[model.cid]
    }
})

module.exports = ViewCollection
