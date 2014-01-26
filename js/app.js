$(function () { 

var DateView = require('./views/date');
var MapView = require('./views/map');
var TwitterView = require('./views/twitter');

var yelpapi = require('./yelpapi');

var DateNiteModel = require('./models/datenite');

var Businesses = require('./collections/businesses');

var app = {};
app.views = {};
app.models = {};
app.collections = {};

app.models.dateNite = new DateNiteModel({yelpdata: {}});
app.models.dateNite.food  = new DateNiteModel({yelpdata: {}});
app.models.dateNite.drink  = new DateNiteModel({yelpdata: {}});

app.views.date = new DateView({model: app.models.dateNite});
// app.views.map = new MapView({model: app.models.dateNite});
app.views.twitter = new TwitterView({model: app.models.dateNite});

app.collections.businesses = new Businesses();

app.views.map = new MapView({collection: app.collections.businesses});

window.app = app;

});