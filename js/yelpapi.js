var auth = { 
  consumerKey: "sOpnEMjxxOJT9o2-TuczeQ",
  consumerSecret: "URVFfpTxXkfx55Jt74IuvKmGz2k",
  accessToken: "Qx_zcTVcrma7NBQkyUw9n8e3N-uRsyal",
  accessTokenSecret: "EnPUU_HlKUY9FmtSQBc1yFKTJsA",
  serviceProvider: { 
    signatureMethod: "HMAC-SHA1"
  }
};

module.exports = exports = function(searchterm, address){ 

  var limit = 1;
  var radius_filter = 500;
  var sort = 2;
  var term = searchterm;
  var near = address;

  parameters = [];
  parameters.push(['term', term]);
  parameters.push(['location', near]);
  parameters.push(['limit', limit]);
  parameters.push(['radius_filter', radius_filter]);
  parameters.push(['sort', sort]);
  parameters.push(['callback', 'cb']);
  parameters.push(['oauth_consumer_key', auth.consumerKey]);
  parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
  parameters.push(['oauth_token', auth.accessToken]);
  parameters.push(['oauth_signature_method', 'HMAC-SHA1']);

  var accessor = {
    consumerSecret: auth.consumerSecret,
    tokenSecret: auth.accessTokenSecret
  };

  var message = { 
    'action': 'http://api.yelp.com/v2/search',
    'method': 'GET',
    'parameters': parameters 
  };

  OAuth.setTimestampAndNonce(message);
  OAuth.SignatureMethod.sign(message, accessor);

  var parameterMap = OAuth.getParameterMap(message.parameters);
  parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature)

  $.ajax({
    'url': message.action,
    'data': parameterMap,
    'cache': true,
    'dataType': 'jsonp',
    // 'jsonpCallback': 'cb',
    'success': function(data, textStats, XMLHttpRequest) {
      if (searchterm == 'food') {
        app.models.dateNite.set(data);
        console.log(data);
        var name = data.businesses[0].name;
        var address = data.businesses[0].location.address +","+ data.businesses[0].location.city +","+ data.businesses[0].location.state_code;
        app.models.dateNite.set({ food: name, foodadd: address });
        console.log(data.businesses[0].name);
      } else {
        var name = data.businesses[0].name;
        var address = data.businesses[0].location.address +", "+ data.businesses[0].location.city +", "+ data.businesses[0].location.state_code;
        app.models.dateNite.set({ drink: name, drinkadd: address });
        console.log(data)
        console.log(data.businesses[0].name);
      };
    }
  });
}