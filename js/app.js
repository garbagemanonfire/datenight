$(function () { 

var DateView = require('./views/date');
var MapView = require('./views/map');
var TwitterView = require('./views/twitter');

var yelpapi = require('./yelpapi');

var searchterm = ''

for (var x = 0; x<2; x++) {
  if (x == 0) {
    searchterm = 'bar'
    yelpapi('bar');
  } else {
    searchterm = 'food'
    yelpapi('food');
  };
};

var DateNiteModel = require('./models/datenite');

var app = {};
app.views = {};
app.models = {};

app.models.dateNite = new DateNiteModel({yelpdata: {}});
app.models.dateNite.food  = new DateNiteModel({yelpdata: {}});
app.models.dateNite.drink  = new DateNiteModel({yelpdata: {}});

app.views.date = new DateView({model: app.models.dateNite});
app.views.map = new MapView({model: app.models.dateNite});
app.views.twitter = new TwitterView({model: app.models.dateNite});

window.app = app;

});