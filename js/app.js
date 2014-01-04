$(function () { 

var DateView = require('./views/date');
var MapView = require('./views/map');
var TwitterView = require('./views/twitter');

var DateNiteModel = require('./models/datenite');

var app = {};
app.views = {};
app.models = {};

var Term = "food"
var Location = "portland"

var url = "http://localhost:7357/?term=" + Term + "&location=" + Location + "&callback=showData";

app.models.dateNite = new DateNiteModel({region: {}});

app.views.date = new DateView({model: app.models.dateNite});
app.views.map = new MapView({model: app.models.dateNite});
app.views.twitter = new TwitterView({model: app.models.dateNite});

window.app = app;

$.ajaxSetup({
    contentType: "application/jsonp; charset=utf-8"
});

$.getJSON(url, function(dateNiteData) {
  app.models.dateNite.set(dateNiteData);
});

});