;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
$(function () { 

var MapView = require('./views/map'),
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

app.collections.businesses = new Businesses();

app.views.map = new MapView({ collection: app.collections.businesses }, app );
app.views.twitter = new TwitterView({ collection: app.collections.businesses }, app );

window.app = app;

});
},{"./collections/businesses":2,"./models/datenite":3,"./views/map":4,"./views/twitter":5,"./yelpapi":6}],2:[function(require,module,exports){
var DateNiteModel = require('../models/datenite');

var Businesses = Backbone.Collection.extend({
    
    model: DateNiteModel

});

module.exports = Businesses;
},{"../models/datenite":3}],3:[function(require,module,exports){
var DateNiteModel = Backbone.Model.extend({


});

module.exports = DateNiteModel;

},{}],4:[function(require,module,exports){
var yelpapi = require('../yelpapi');

module.exports = Backbone.View.extend({
  el: '#map',
  template: require('../../templates/map.hbs'),
  events: {
    "click .geocode": "resetMap",
    "click #food" : "infoclicker",
    "click #drink" : "infoclicker",
  },
  initialize: initialize,
  render : render,
  resetMap : resetMap,
  addmarker : addmarker,
  infoclicker : infoclicker,
  centerMap : centerMap,
});

function initialize(viewOptions, app) {
  this.app = app;
  this.address = '';
  this.terms = [
      'Food',
      'Bar'
    ];
  this.map = {};
  this.markers = [];
  this.infowindows = [];
  this.listenTo(this.collection, 'add', this.addmarker);
  google.maps.visualRefresh = true;
  this.render();
};

function render() {
  this.$el.html(this.template());

  _setMap.call(this);
};

function resetMap(address) {
  var self = this;

  this.address = this.$el.find('#address').val();

  _geocode.call(this, this.address)
    .then(function(location) {
      self.map.setCenter(location);
      _.each(self.terms, function(term) {
        _yelpdata.call(self, term);
      });
    })
    .fail(function(status){
      alert("This address cannot be retrieved from the server");
    });

  this.centerMap(this, this.map, this.markers);
};

function addmarker(model) {
  var self = this,
    marker;

  if (!this.markers.length == 0 && !this.collection.models[1]) {
   _removeMarkers.call(this);
   _removeInfowindows.call(this);
  };

  _geocode.call(this, model.get('address'))
    .done(function(location) {
      marker = new google.maps.Marker({
        map: self.map,
        position: location
      });
      self.markers.push(marker);
      _infowindow.call(self, marker, model);
    })
    .fail(function() {
      console.log("This address cannot be retrieved from the server");
    });
};

function centerMap(map, markers){
  var bounds = new google.maps.LatLngBounds();

  for(i=0;i<markers.length;i++) {
    bounds.extend(markers[i].getPosition());
  };

  this.map.fitBounds(bounds);
};

function infoclicker(e) {
  var self = this,
    id = e.target.id,
    infowindow,
    marker;

    e.preventDefault();

    if (id == 'food' || id == 'resturantIcon') {
      marker = self.markers[0];
      infowindow = self.infowindows[0];
      infowindow.open(this.map, marker);
    } else if (id == 'drink' || id == 'barIcon') {
      marker = self.markers[1];
      infowindow = self.infowindows[1];
      infowindow.open(this.map, marker);
    };
};

function _setMap(zoom, lat, long) {
  var mapOptions = {
      zoom: zoom ? zoom : 15,
      minZoom: 14,
      center: new google.maps.LatLng(lat ? lat : 45.5200,long ? long : -122.6819)
    };
  this.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
};

function _removeMarkers(map, markers) {
  for (var i = 0; i < this.markers.length; i++) {
    this.markers[i].setMap(null);
  };
  this.markers = [];
};

function _removeInfowindows(map, infowindows) {
  for (var i = 0; i < this.infowindows.length; i++) {
    this.infowindows[i].setMap(null);
  };
  this.infowindows = [];
};

function _geocode(address) {
  var $deferred = new $.Deferred();

  new google.maps.Geocoder().geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      $deferred.resolve(results[0].geometry.location);
    } else {
      $deferred.reject(status);
    }
  });
  return $deferred.promise();
};

function _yelpdata(term) {
  var data;
  this.app.collections.businesses.reset();

  yelpapi.getResults(term, this.address)
    .done(function(data, term) {
      _addModelToCollection.call(self, data, term);
    })
    .fail(function() {
      console.log('Oh poop')
    });
};

function _addModelToCollection(data, term) {
  this.app.collections.businesses.add({
    name: data.businesses[0].name,
    address: data.businesses[0].location.address +","+ data.businesses[0].location.city +","+ data.businesses[0].location.state_code,
    type: term,
    tweetstring:["Meet me at ", data.businesses[0].name, " located at ", data.businesses[0].location.address].join("")
  });
};

function _infowindow(marker, model) {

  var contentString = '<div id="content">'+
    '<p>'+ model.get('name') +'</p>' + '</div>';

  var infowindow = new google.maps.InfoWindow({
    content: contentString,
    maxWidth: 700
  });

  this.infowindows.push(infowindow);
};
},{"../../templates/map.hbs":13,"../yelpapi":6}],5:[function(require,module,exports){
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

},{"../../templates/twitter.hbs":14}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
"use strict";
var base = require("./handlebars/base");

// Each of these augment the Handlebars object. No need to setup here.
// (This is done to easily share code between commonjs and browse envs)
var SafeString = require("./handlebars/safe-string")["default"];
var Exception = require("./handlebars/exception")["default"];
var Utils = require("./handlebars/utils");
var runtime = require("./handlebars/runtime");

// For compatibility and usage outside of module systems, make the Handlebars object a namespace
var create = function() {
  var hb = new base.HandlebarsEnvironment();

  Utils.extend(hb, base);
  hb.SafeString = SafeString;
  hb.Exception = Exception;
  hb.Utils = Utils;

  hb.VM = runtime;
  hb.template = function(spec) {
    return runtime.template(spec, hb);
  };

  return hb;
};

var Handlebars = create();
Handlebars.create = create;

exports["default"] = Handlebars;
},{"./handlebars/base":8,"./handlebars/exception":9,"./handlebars/runtime":10,"./handlebars/safe-string":11,"./handlebars/utils":12}],8:[function(require,module,exports){
"use strict";
/*globals Exception, Utils */
var Utils = require("./utils");
var Exception = require("./exception")["default"];

var VERSION = "1.1.2";
exports.VERSION = VERSION;var COMPILER_REVISION = 4;
exports.COMPILER_REVISION = COMPILER_REVISION;
var REVISION_CHANGES = {
  1: '<= 1.0.rc.2', // 1.0.rc.2 is actually rev2 but doesn't report it
  2: '== 1.0.0-rc.3',
  3: '== 1.0.0-rc.4',
  4: '>= 1.0.0'
};
exports.REVISION_CHANGES = REVISION_CHANGES;
var isArray = Utils.isArray,
    isFunction = Utils.isFunction,
    toString = Utils.toString,
    objectType = '[object Object]';

function HandlebarsEnvironment(helpers, partials) {
  this.helpers = helpers || {};
  this.partials = partials || {};

  registerDefaultHelpers(this);
}

exports.HandlebarsEnvironment = HandlebarsEnvironment;HandlebarsEnvironment.prototype = {
  constructor: HandlebarsEnvironment,

  logger: logger,
  log: log,

  registerHelper: function(name, fn, inverse) {
    if (toString.call(name) === objectType) {
      if (inverse || fn) { throw new Exception('Arg not supported with multiple helpers'); }
      Utils.extend(this.helpers, name);
    } else {
      if (inverse) { fn.not = inverse; }
      this.helpers[name] = fn;
    }
  },

  registerPartial: function(name, str) {
    if (toString.call(name) === objectType) {
      Utils.extend(this.partials,  name);
    } else {
      this.partials[name] = str;
    }
  }
};

function registerDefaultHelpers(instance) {
  instance.registerHelper('helperMissing', function(arg) {
    if(arguments.length === 2) {
      return undefined;
    } else {
      throw new Error("Missing helper: '" + arg + "'");
    }
  });

  instance.registerHelper('blockHelperMissing', function(context, options) {
    var inverse = options.inverse || function() {}, fn = options.fn;

    if (isFunction(context)) { context = context.call(this); }

    if(context === true) {
      return fn(this);
    } else if(context === false || context == null) {
      return inverse(this);
    } else if (isArray(context)) {
      if(context.length > 0) {
        return instance.helpers.each(context, options);
      } else {
        return inverse(this);
      }
    } else {
      return fn(context);
    }
  });

  instance.registerHelper('each', function(context, options) {
    var fn = options.fn, inverse = options.inverse;
    var i = 0, ret = "", data;

    if (isFunction(context)) { context = context.call(this); }

    if (options.data) {
      data = createFrame(options.data);
    }

    if(context && typeof context === 'object') {
      if (isArray(context)) {
        for(var j = context.length; i<j; i++) {
          if (data) {
            data.index = i;
            data.first = (i === 0)
            data.last  = (i === (context.length-1));
          }
          ret = ret + fn(context[i], { data: data });
        }
      } else {
        for(var key in context) {
          if(context.hasOwnProperty(key)) {
            if(data) { data.key = key; }
            ret = ret + fn(context[key], {data: data});
            i++;
          }
        }
      }
    }

    if(i === 0){
      ret = inverse(this);
    }

    return ret;
  });

  instance.registerHelper('if', function(conditional, options) {
    if (isFunction(conditional)) { conditional = conditional.call(this); }

    // Default behavior is to render the positive path if the value is truthy and not empty.
    // The `includeZero` option may be set to treat the condtional as purely not empty based on the
    // behavior of isEmpty. Effectively this determines if 0 is handled by the positive path or negative.
    if ((!options.hash.includeZero && !conditional) || Utils.isEmpty(conditional)) {
      return options.inverse(this);
    } else {
      return options.fn(this);
    }
  });

  instance.registerHelper('unless', function(conditional, options) {
    return instance.helpers['if'].call(this, conditional, {fn: options.inverse, inverse: options.fn, hash: options.hash});
  });

  instance.registerHelper('with', function(context, options) {
    if (isFunction(context)) { context = context.call(this); }

    if (!Utils.isEmpty(context)) return options.fn(context);
  });

  instance.registerHelper('log', function(context, options) {
    var level = options.data && options.data.level != null ? parseInt(options.data.level, 10) : 1;
    instance.log(level, context);
  });
}

var logger = {
  methodMap: { 0: 'debug', 1: 'info', 2: 'warn', 3: 'error' },

  // State enum
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  level: 3,

  // can be overridden in the host environment
  log: function(level, obj) {
    if (logger.level <= level) {
      var method = logger.methodMap[level];
      if (typeof console !== 'undefined' && console[method]) {
        console[method].call(console, obj);
      }
    }
  }
};
exports.logger = logger;
function log(level, obj) { logger.log(level, obj); }

exports.log = log;var createFrame = function(object) {
  var obj = {};
  Utils.extend(obj, object);
  return obj;
};
exports.createFrame = createFrame;
},{"./exception":9,"./utils":12}],9:[function(require,module,exports){
"use strict";

var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];

function Exception(/* message */) {
  var tmp = Error.prototype.constructor.apply(this, arguments);

  // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
  for (var idx = 0; idx < errorProps.length; idx++) {
    this[errorProps[idx]] = tmp[errorProps[idx]];
  }
}

Exception.prototype = new Error();

exports["default"] = Exception;
},{}],10:[function(require,module,exports){
"use strict";
/*global Utils */
var Utils = require("./utils");
var Exception = require("./exception")["default"];
var COMPILER_REVISION = require("./base").COMPILER_REVISION;
var REVISION_CHANGES = require("./base").REVISION_CHANGES;

function checkRevision(compilerInfo) {
  var compilerRevision = compilerInfo && compilerInfo[0] || 1,
      currentRevision = COMPILER_REVISION;

  if (compilerRevision !== currentRevision) {
    if (compilerRevision < currentRevision) {
      var runtimeVersions = REVISION_CHANGES[currentRevision],
          compilerVersions = REVISION_CHANGES[compilerRevision];
      throw new Error("Template was precompiled with an older version of Handlebars than the current runtime. "+
            "Please update your precompiler to a newer version ("+runtimeVersions+") or downgrade your runtime to an older version ("+compilerVersions+").");
    } else {
      // Use the embedded version info since the runtime doesn't know about this revision yet
      throw new Error("Template was precompiled with a newer version of Handlebars than the current runtime. "+
            "Please update your runtime to a newer version ("+compilerInfo[1]+").");
    }
  }
}

// TODO: Remove this line and break up compilePartial

function template(templateSpec, env) {
  if (!env) {
    throw new Error("No environment passed to template");
  }

  var invokePartialWrapper;
  if (env.compile) {
    invokePartialWrapper = function(partial, name, context, helpers, partials, data) {
      // TODO : Check this for all inputs and the options handling (partial flag, etc). This feels
      // like there should be a common exec path
      var result = invokePartial.apply(this, arguments);
      if (result) { return result; }

      var options = { helpers: helpers, partials: partials, data: data };
      partials[name] = env.compile(partial, { data: data !== undefined }, env);
      return partials[name](context, options);
    };
  } else {
    invokePartialWrapper = function(partial, name /* , context, helpers, partials, data */) {
      var result = invokePartial.apply(this, arguments);
      if (result) { return result; }
      throw new Exception("The partial " + name + " could not be compiled when running in runtime-only mode");
    };
  }

  // Just add water
  var container = {
    escapeExpression: Utils.escapeExpression,
    invokePartial: invokePartialWrapper,
    programs: [],
    program: function(i, fn, data) {
      var programWrapper = this.programs[i];
      if(data) {
        programWrapper = program(i, fn, data);
      } else if (!programWrapper) {
        programWrapper = this.programs[i] = program(i, fn);
      }
      return programWrapper;
    },
    merge: function(param, common) {
      var ret = param || common;

      if (param && common && (param !== common)) {
        ret = {};
        Utils.extend(ret, common);
        Utils.extend(ret, param);
      }
      return ret;
    },
    programWithDepth: programWithDepth,
    noop: noop,
    compilerInfo: null
  };

  return function(context, options) {
    options = options || {};
    var namespace = options.partial ? options : env,
        helpers,
        partials;

    if (!options.partial) {
      helpers = options.helpers;
      partials = options.partials;
    }
    var result = templateSpec.call(
          container,
          namespace, context,
          helpers,
          partials,
          options.data);

    if (!options.partial) {
      checkRevision(container.compilerInfo);
    }

    return result;
  };
}

exports.template = template;function programWithDepth(i, fn, data /*, $depth */) {
  var args = Array.prototype.slice.call(arguments, 3);

  var prog = function(context, options) {
    options = options || {};

    return fn.apply(this, [context, options.data || data].concat(args));
  };
  prog.program = i;
  prog.depth = args.length;
  return prog;
}

exports.programWithDepth = programWithDepth;function program(i, fn, data) {
  var prog = function(context, options) {
    options = options || {};

    return fn(context, options.data || data);
  };
  prog.program = i;
  prog.depth = 0;
  return prog;
}

exports.program = program;function invokePartial(partial, name, context, helpers, partials, data) {
  var options = { partial: true, helpers: helpers, partials: partials, data: data };

  if(partial === undefined) {
    throw new Exception("The partial " + name + " could not be found");
  } else if(partial instanceof Function) {
    return partial(context, options);
  }
}

exports.invokePartial = invokePartial;function noop() { return ""; }

exports.noop = noop;
},{"./base":8,"./exception":9,"./utils":12}],11:[function(require,module,exports){
"use strict";
// Build out our basic SafeString type
function SafeString(string) {
  this.string = string;
}

SafeString.prototype.toString = function() {
  return "" + this.string;
};

exports["default"] = SafeString;
},{}],12:[function(require,module,exports){
"use strict";
var SafeString = require("./safe-string")["default"];

var escape = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "`": "&#x60;"
};

var badChars = /[&<>"'`]/g;
var possible = /[&<>"'`]/;

function escapeChar(chr) {
  return escape[chr] || "&amp;";
}

function extend(obj, value) {
  for(var key in value) {
    if(value.hasOwnProperty(key)) {
      obj[key] = value[key];
    }
  }
}

exports.extend = extend;var toString = Object.prototype.toString;
exports.toString = toString;
// Sourced from lodash
// https://github.com/bestiejs/lodash/blob/master/LICENSE.txt
var isFunction = function(value) {
  return typeof value === 'function';
};
// fallback for older versions of Chrome and Safari
if (isFunction(/x/)) {
  isFunction = function(value) {
    return typeof value === 'function' && toString.call(value) === '[object Function]';
  };
}
var isFunction;
exports.isFunction = isFunction;
var isArray = Array.isArray || function(value) {
  return (value && typeof value === 'object') ? toString.call(value) === '[object Array]' : false;
};
exports.isArray = isArray;

function escapeExpression(string) {
  // don't escape SafeStrings, since they're already safe
  if (string instanceof SafeString) {
    return string.toString();
  } else if (!string && string !== 0) {
    return "";
  }

  // Force a string conversion as this will be done by the append regardless and
  // the regex test will do this transparently behind the scenes, causing issues if
  // an object's to string has escaped characters in it.
  string = "" + string;

  if(!possible.test(string)) { return string; }
  return string.replace(badChars, escapeChar);
}

exports.escapeExpression = escapeExpression;function isEmpty(value) {
  if (!value && value !== 0) {
    return true;
  } else if (isArray(value) && value.length === 0) {
    return true;
  } else {
    return false;
  }
}

exports.isEmpty = isEmpty;
},{"./safe-string":11}],13:[function(require,module,exports){
var templater = require("/Users/nmcgiver/Code/JavaScript/Datenite/datenight/node_modules/browserify-handlebars/node_modules/handlebars/dist/cjs/handlebars.runtime").default.template;module.exports = templater(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<script type=\"text/javascript\" src=\"js/lib/fancyjq.js\"></script>\n\n<input id=\"address\" type=\"text\" class=\"form-control col-lg-8\" value=\"Portland, OR\">\n<input id=\"searchbtn\" type=\"button\" value=\"Find\" class=\"geocode btn btn-success\">\n    <br>\n    <br>\n    <br>\n<div id=\"map-canvas\"></div>\n\n<div class=\"buttons\">\n    <div class=\"food-container\">\n        <div class=\"food\">\n            <h4>Feed Me</h4>\n            <button class=\"btn btn-success\" id=\"food\">\n                <img src=\"images/buttons/Bread-Icon.jpg\" id=\"restaurantIcon\" alt=\"Restaurant\" title=\"Restaurant\"/>\n            </button>\n            </br>\n        </div>\n    </div>\n\n    <div class=\"drink-container\">\n        <div class=\"drink\">\n            <h4>Beer Me</h4>\n            <button class=\"btn btn-success\" id=\"drink\">\n                <img src=\"images/buttons/Beer-icon.jpg\" id=\"barIcon\" alt=\"Bar\" title=\"Bar\"/>\n            </button>\n            </br>\n        </div>\n    </div>\n</div>";
  });
},{"/Users/nmcgiver/Code/JavaScript/Datenite/datenight/node_modules/browserify-handlebars/node_modules/handlebars/dist/cjs/handlebars.runtime":7}],14:[function(require,module,exports){
var templater = require("/Users/nmcgiver/Code/JavaScript/Datenite/datenight/node_modules/browserify-handlebars/node_modules/handlebars/dist/cjs/handlebars.runtime").default.template;module.exports = templater(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"twitter\">\n    <div class=\"tweet-food\">\n        <a href=\"https://twitter.com/intent/tweet?button_hashtag=feedme\" class=\"twitter-hashtag-button\" data-size=\"large\" data-text=\""
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.businesses0)),stack1 == null || stack1 === false ? stack1 : stack1.attributes)),stack1 == null || stack1 === false ? stack1 : stack1.tweetstring)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" data-count=\"none\" data-lang=\"en\">Tweet</a>\n    </div>\n    <div class=\"tweet-drink\">\n        <a href=\"https://twitter.com/intent/tweet?button_hashtag=beerme\" class=\"twitter-hashtag-button\" data-size=\"large\" data-text=\""
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.businesses1)),stack1 == null || stack1 === false ? stack1 : stack1.attributes)),stack1 == null || stack1 === false ? stack1 : stack1.tweetstring)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" data-count=\"none\" data-lang=\"en\" >Tweet</a>\n    </div>\n</div>\n";
  return buffer;
  });
},{"/Users/nmcgiver/Code/JavaScript/Datenite/datenight/node_modules/browserify-handlebars/node_modules/handlebars/dist/cjs/handlebars.runtime":7}]},{},[1])
;