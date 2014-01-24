var yelpapi = require('../yelpapi');

var MapView = Backbone.View.extend({
  el: '#map', 

  template: require('../../templates/map.hbs'),

  initialize: function () {
    this.listenTo(this.model, 'change', this.render);
    this.render();
  },

// Render the view with a default map location.
  render: function () {
    google.maps.event.addDomListener(window, 'onload', this.initialize);
    
    // var drinkstorage = {}
    // drinkstorage.drink = this.model.get('drink') || null
    // console.log(drinkstorage.drink)
    
    this.$el.html(this.template());

    // This sets the intial map location on page load
    var latlng = new google.maps.LatLng(45.5200, -122.6819);

    var mapOptions = {
      zoom: 13,
      center: latlng
    }

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    
    // if(!drinkstorage.drink) return this; // Stop and reload if data from api has not loaded.

    // return this;
  },

// On button click call codeAddress
  events: {
    "click .geocode": "yelpDatapass",
  },

  yelpDatapass: function(){
    var address = document.getElementById('address').value;
    searchterm = ''
    function yelpsearch(searchterm, address){
        for (var x = 0; x<2; x++) {
          if (x == 0) {
            searchterm = 'bar'
            yelpapi(searchterm, address);
          } else {
            searchterm = 'food'
            yelpapi(searchterm, address);
          };
        };
    };
    var update = yelpsearch(searchterm, address)

    this.codeAddress(address);
  },

  // Transform the address to a location using Google's API

  codeAddress: function(address) {
    console.log("Button Clicked");

    var address = address.toString();
    var geocoder = new google.maps.Geocoder();

    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        map.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location
        });
      } else {
        alert('Search was not successful for the following reason: ' + status);
      }
    });

    // Pulls data from Yelp API
    var drinkstorage = {}
    drinkstorage.drink = this.model.get('drink') || null
    drinkstorage.drinkadd = this.model.get('drinkadd') || null

    console.log("Before the empty data test call");
    if(!drinkstorage.drinkadd) return this;
    console.log("After the empty data test call");

    var foodstorage = {}
    foodstorage.food = this.model.get('food') || null
    foodstorage.foodadd = this.model.get('foodadd') || null

    // Create the info window box.
    var drinkcontentString = '<div id="content">'+
      '<p>'+ drinkstorage.drink +'</p>' + '<p>'+ drinkstorage.drinkadd +'</p>'+'</div>';

    var foodcontentString = '<div id="content">'+
      '<p>'+ foodstorage.food +'</p>' + '<p>'+ foodstorage.foodadd +'</p>'+'</div>';

    var drinkinfowindow = new google.maps.InfoWindow({
      content: drinkcontentString
    });

    var foodinfowindow = new google.maps.InfoWindow({
      content: foodcontentString
    });
    
    address = drinkstorage.drinkadd 

    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        var marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location
        });
        drinkinfowindow.open(map,marker);
      } else {
        alert('Search was not successful for the following reason: ' + status);
      }
    });

    address = foodstorage.foodadd

    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        var marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location
        });
        foodinfowindow.open(map,marker);
      } else {
        alert('Search was not successful for the following reason: ' + status);
      }
    });

  return this;

  },

});

module.exports = MapView;