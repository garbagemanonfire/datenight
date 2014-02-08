var yelpapi = require('../yelpapi');

module.exports = Backbone.View.extend({
  el: '#map', 
  template: require('../../templates/map.hbs'),
  events: {
    "click .geocode": "resetMap",
    // "click .marker" : "infoclicker"
  },
  initialize: initialize,
  render : render,
  resetMap : resetMap,
  addmarker : addmarker,
  infoclicker : infoclicker,
});


function initialize(viewOptions, app) {
  this.app = app;
  this.address = '';
  this.terms = [
      'Food',
      'Bar'
    ];
  this.markers = [];
  // this.listenTo(this.collection, 'reset', this.render);
  this.listenTo(this.collection, 'add', this.addmarker);
  this.render();
  google.maps.event.addListener(this.map, 'click', function() {
    console.log('Clicked')
  });
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
};

function addmarker(model) {
  var self = this,
    marker;

  _geocode.call(this, model.get('address'))
    .done(function(location) {
      marker = new google.maps.Marker({ 
        map: self.map,
        position: location
      });
      _infowindow.call(self, marker, model);
    })
    .fail(function() {
      console.log("This address cannot be retrieved from the server");
    });
};

function _setMap(zoom, lat, long) {
  var mapOptions = {
      zoom: zoom ? zoom : 16,
      center: new google.maps.LatLng(lat ? lat : 45.5200,long ? long : -122.6819)
    };

  this.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
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
    '<p>'+ model.get('name') +'</p>' + '</div>'

  var infowindow = new google.maps.InfoWindow({
    content: contentString
  });

  infowindow.open(this.map, marker); 
};

function infoclicker() {
  console.log("Clicked")
  // infowindow.open(map, marker);
};
