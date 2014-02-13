module.exports = Backbone.View.extend({
  el: '#twitter',
  template: require('../../templates/twitter.hbs'),
  // events: {
  //   "click .twitter-share-button": "onTweet",
  // },
  initialize: initialize,
  render : render,
  onTweet : onTweet,
  tweetBuild : tweetBuild,
});

function initialize(app) {
  this.app = app;
  this.context = {
    businesses0 : {
      attributes : {
        tweetstring : 'Date Night'
      }
    }
  };

  this.listenTo(this.collection, 'add', tweetBuild);
  this.render();
};

function render() {
  this.$el.html(this.template(this.context));
  // disabled, but shows button on first page
  this.onTweet();
};

function tweetBuild(model) {
  this.context.businesses0 = this.collection.models[0];
  this.context.businesses1 = this.collection.models[1];
  this.$el.html(this.template(this.context));
  // this.onTweet();
  twttr.widgets.load();
};

function onTweet() {
  !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="https://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");
};
