var MapView = Backbone.View.extend({
  el: '#map', // every Backbone view has an associated DOM element

  template: require('../../templates/map.hbs'),

  initialize: function () {
    this.listenTo(this.model, 'change', this.render);
    this.render();
  },

  render: function () {
    var context = {}
    context.businesses = this.model.get('businesses') || {};
    this.$el.html(this.template(context));
    return this;
  }

});

module.exports = MapView;