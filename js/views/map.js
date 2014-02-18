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
      marker = self.markers[1];
      infowindow = self.infowindows[1];
      infowindow.open(this.map, marker);
    } else if (id == 'drink' || id == 'barIcon') {
      marker = self.markers[0];
      infowindow = self.infowindows[0];
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
    maxWidth: 900
  });

  this.infowindows.push(infowindow);
};
