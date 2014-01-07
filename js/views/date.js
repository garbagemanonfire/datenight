var DateView = Backbone.View.extend({
  el: '#current',

  template: require('../../templates/date.hbs'),

  initialize: function () {
    this.listenTo(this.model, 'change', this.render);
    this.render();
  },

  render: function () {
    var context = {}
    context.businesses = this.model.get('businesses') || {};
    this.$el.html(this.template(context));
    return this;
  },

});

module.exports = DateView;