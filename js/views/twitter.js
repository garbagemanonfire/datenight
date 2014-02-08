module.exports = Backbone.View.extend({
  el: '#twitter',
  template: require('../../templates/twitter.hbs'),
  events: {
    "click .twitter-share-button": "onTweet",
  },
  initialize: initialize,
  render : render,
  onTweet : onTweet,
  tweetBuild : tweetBulid,
});

function initialize(app) {
  this.app = app;
  this.context = {};
  this.listenTo(this.collection, 'add', tweetBulid);
  this.render();
};

function render() {
  this.$el.html(this.template());

};

function tweetBulid(model) {
  this.context.businesses0 = this.collection.models[0];
  this.context.businesses1 = this.collection.models[1];
  this.$el.html(this.template(this.context));
};

function onTweet() {

  !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="https://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");  
};
