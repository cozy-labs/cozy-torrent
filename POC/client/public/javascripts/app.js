(function() {
  'use strict';

  var globals = typeof window === 'undefined' ? global : window;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var has = ({}).hasOwnProperty;

  var aliases = {};

  var endsWith = function(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  };

  var unalias = function(alias, loaderPath) {
    var start = 0;
    if (loaderPath) {
      if (loaderPath.indexOf('components/' === 0)) {
        start = 'components/'.length;
      }
      if (loaderPath.indexOf('/', start) > 0) {
        loaderPath = loaderPath.substring(start, loaderPath.indexOf('/', start));
      }
    }
    var result = aliases[alias + '/index.js'] || aliases[loaderPath + '/deps/' + alias + '/index.js'];
    if (result) {
      return 'components/' + result.substring(0, result.length - '.js'.length);
    }
    return alias;
  };

  var expand = (function() {
    var reg = /^\.\.?(\/|$)/;
    return function(root, name) {
      var results = [], parts, part;
      parts = (reg.test(name) ? root + '/' + name : name).split('/');
      for (var i = 0, length = parts.length; i < length; i++) {
        part = parts[i];
        if (part === '..') {
          results.pop();
        } else if (part !== '.' && part !== '') {
          results.push(part);
        }
      }
      return results.join('/');
    };
  })();
  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';
    path = unalias(name, loaderPath);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has.call(cache, dirIndex)) return cache[dirIndex].exports;
    if (has.call(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  require.register = require.define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  require.list = function() {
    var result = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  require.brunch = true;
  globals.require = require;
})();
require.register("application", function(exports, require, module) {
// Application bootstrapper.
var Application = {
  initialize: function () {
    var HomeView = require('views/home_view')
    var ListDl = require('./collections/dl_list')
    var ListDlView = require('./views/dl_list')


    this.homeView = new HomeView();

    $('body').html(this.homeView.render().el);

    this.listDl = new ListDl()
    this.listDlView = new ListDlView({collection: this.listDl})

    this.listDlView.render()

    //this.listDl.fetch()


    if (typeof Object.freeze === 'function') {
      Object.freeze(this);
    }
  }
};

module.exports = Application;

});

require.register("collections/dl_list", function(exports, require, module) {

var Dl = require('../models/dl')

module.exports =  Backbone.Collection.extend({
    model: Dl,
    url: 'dl',
})

});

;require.register("initialize", function(exports, require, module) {
var application = require('application');

$(function () {
  application.initialize();
  Backbone.history.start();
});

});

require.register("lib/view_collection", function(exports, require, module) {

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

});

;require.register("lib/view_helper", function(exports, require, module) {
// Put your handlebars.js helpers here.

});

;require.register("models/dl", function(exports, require, module) {


module.exports =  Backbone.Model.extend({
})

});

;require.register("views/dl_list", function(exports, require, module) {


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

});

;require.register("views/dl_row", function(exports, require, module) {

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

});

;require.register("views/home_view", function(exports, require, module) {

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

});

;require.register("views/templates/dl_list", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge
/**/) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<table class="table table-striped"><thead><tr><th>Title</th><th>Length</th></tr></thead><tbody id="table-items-content"></tbody></table>');
}
return buf.join("");
};
});

require.register("views/templates/dl_row", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge
/**/) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<td>you\'r a winner!</td><td>' + escape((interp = model.plays) == null ? '' : interp) + '</td><td>' + escape((interp = model.time) == null ? '' : interp) + '</td>');
}
return buf.join("");
};
});

require.register("views/templates/home", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge
/**/) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div id="content"><div class="page-header"><div class="row"><div class="input-group"><input id="magnet-input" type="text" placeholder="Add magnet" class="form-control"/><span class="input-group-btn"><button id="menu-add-magnet" role="presentation" class="btn btn-default">Go</button></span></div></div></div><div id="menu" class="nav nav-tabs"></div><div id="dl-content"></div></div><p>exemple:</p><p>Book -> \'magnet:?xt=urn:btih:C472D99E7C2260D97F063298E751DA975FA19B19&dn=How+to+learn+seo%2Cphp%2Cwordpress+In+telugu&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A80&tr=udp%3A%2F%2Fopen.demonii.com%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80%2Fannounce&tr=udp%3A%2F%2F9.rarbg.to%3A2710%2Fannounce&tr=udp%3A%2F%2Ftracker.trackerfix.com%3A80%2Fannounce&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969%2Fannounce\'</p><p>ArchLinux -> \'magnet:?xt=urn:btih:252b8cb7144fa583de1a68a0298e1ee255b7c7ac&dn=archlinux-2015.09.01-dual.iso&tr=udp://tracker.archlinux.org:6969&tr=http://tracker.archlinux.org:6969/announce\'</p>');
}
return buf.join("");
};
});

require.register("views/view", function(exports, require, module) {
require('lib/view_helper');

// Base class for all views.
module.exports = Backbone.View.extend({
    initialize: function () {
        this.render = _.bind(this.render, this);
    },

    template: function () { return null; },
    getRenderData: function () { return null; },

    render: function () {
        console.log('render view: ', this.template)
        this.$el.html(this.template(this.getRenderData()));
        this.afterRender();
        return this;
    },

    afterRender: function () { return null; }
});

});


//# sourceMappingURL=app.js.map