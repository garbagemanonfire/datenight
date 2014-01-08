var TwitterView = Backbone.View.extend({
  el: '#twitter',
  
  template: require('../../templates/twitter.hbs'),

  initialize: function () {
    this.listenTo(this.model, 'change', this.render);
    this.render();
  },

  render: function () {
    var context = {}
    context.currently = this.model.get('currently') || {};
    this.$el.html(this.template(context));
    return this;
  }

});

module.exports = TwitterView;