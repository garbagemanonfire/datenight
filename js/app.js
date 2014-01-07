$(function () { 

var DateView = require('./views/date');
var MapView = require('./views/map');
var TwitterView = require('./views/twitter');

var DateNiteModel = require('./models/datenite');

var app = {};
app.views = {};
app.models = {};

// var Term = "food"
// var Location = "portland"

// var url = "http://localhost:7357/?term=" + Term + "&location=" + Location + "?callback=?";


var auth = { 
  //
  // Update with your auth tokens
  //
  consumerKey: "sOpnEMjxxOJT9o2-TuczeQ",
  consumerSecret: "URVFfpTxXkfx55Jt74IuvKmGz2k",
  accessToken: "Qx_zcTVcrma7NBQkyUw9n8e3N-uRsyal",
  // This example is a proof of concept, for how to use the Yelp v2 API with javascript.
  // You wouldn't actually want to expose your access token secret like this in a real application.
  accessTokenSecret: "EnPUU_HlKUY9FmtSQBc1yFKTJsA",
  serviceProvider: { 
    signatureMethod: "HMAC-SHA1"
  }
};


var terms = 'food';
var near = 'portland';

var accessor = {
  consumerSecret: auth.consumerSecret,
  tokenSecret: auth.accessTokenSecret
};

parameters = [];
parameters.push(['term', terms]);
parameters.push(['location', near]);
parameters.push(['callback', 'cb']);
parameters.push(['oauth_consumer_key', auth.consumerKey]);
parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
parameters.push(['oauth_token', auth.accessToken]);
parameters.push(['oauth_signature_method', 'HMAC-SHA1']);

var message = { 
  'action': 'http://api.yelp.com/v2/search',
  'method': 'GET',
  'parameters': parameters 
};

OAuth.setTimestampAndNonce(message);
OAuth.SignatureMethod.sign(message, accessor);

var parameterMap = OAuth.getParameterMap(message.parameters);
parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature)
console.log(parameterMap);

app.models.dateNite = new DateNiteModel({yelpdata: {}});

$.ajax({
  'url': message.action,
  'data': parameterMap,
  'cache': true,
  'dataType': 'jsonp',
  'jsonpCallback': 'cb',
  'success': function(data, textStats, XMLHttpRequest) {
    console.log(data);
    // var output = prettyPrint(data);
    // $("body").append(output);
    app.models.dateNite.set(data);
  }
});

app.views.date = new DateView({model: app.models.dateNite});
app.views.map = new MapView({model: app.models.dateNite});
app.views.twitter = new TwitterView({model: app.models.dateNite});

window.app = app;

// $.getJSON(url, function(dateNiteData) {
//   app.models.dateNite.set(dateNiteData);
// });

});