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
