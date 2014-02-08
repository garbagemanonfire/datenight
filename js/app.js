$(function () { 

var DateView = require('./views/date'),
    MapView = require('./views/map'),
    TwitterView = require('./views/twitter'),
    yelpapi = require('./yelpapi'),
    DateNiteModel = require('./models/datenite'),
    Businesses = require('./collections/businesses'),
    app = {};

app.views = {};
app.models = {};
app.collections = {};

app.models.dateNite = new DateNiteModel({yelpdata: {}});
app.models.dateNite.food  = new DateNiteModel({yelpdata: {}});
app.models.dateNite.drink  = new DateNiteModel({yelpdata: {}});

app.views.date = new DateView({model: app.models.dateNite});
// app.views.map = new MapView({model: app.models.dateNite});
// app.views.twitter = new TwitterView({model: app.models.dateNite});

app.collections.businesses = new Businesses();

app.views.map = new MapView({ collection: app.collections.businesses }, app );
app.views.twitter = new TwitterView({ collection: app.collections.businesses }, app );

window.app = app;

});