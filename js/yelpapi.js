module.exports = {
  getResults : getResults
};

var auth = {
  consumerKey: "sOpnEMjxxOJT9o2-TuczeQ",
  consumerSecret: "URVFfpTxXkfx55Jt74IuvKmGz2k",
  accessToken: "Qx_zcTVcrma7NBQkyUw9n8e3N-uRsyal",
  accessTokenSecret: "EnPUU_HlKUY9FmtSQBc1yFKTJsA",
  serviceProvider: {
    signatureMethod: "HMAC-SHA1"
  }
};

function getResults(term, near){
  var $deferred = new $.Deferred(),
    self = this,
    limit = 1,
    radius_filter = 1000,
    sort = 2,
    accessor = {
      consumerSecret: auth.consumerSecret,
      tokenSecret: auth.accessTokenSecret
    },
    message = {
      action: 'http://api.yelp.com/v2/search',
      method: 'GET',
      parameters: []
    };

  message.parameters.push(['term', term]);
  message.parameters.push(['location', near]);
  message.parameters.push(['limit', limit]);
  message.parameters.push(['radius_filter', radius_filter]);
  message.parameters.push(['sort', sort]);
  message.parameters.push(['callback', 'cb']);
  message.parameters.push(['oauth_consumer_key', auth.consumerKey]);
  message.parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
  message.parameters.push(['oauth_token', auth.accessToken]);
  message.parameters.push(['oauth_signature_method', 'HMAC-SHA1']);

  OAuth.setTimestampAndNonce(message);
  OAuth.SignatureMethod.sign(message, accessor);

  var parameterMap = OAuth.getParameterMap(message.parameters);
  parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature)

  _makeApiCall.call(this, message, parameterMap)
    .done(function(data) {
      $deferred.resolve(data, term);
    })
    .fail(function() {
      $deferred.reject();
    });

  return $deferred.promise();
};

function _makeApiCall(message, parameterMap) {
  return $.ajax({
    'url': message.action,
    'data': parameterMap,
    'cache': true,
    'dataType': 'jsonp',
    // 'jsonpCallback': 'cb',
  });
};
