var yelpapi = require('../yelpapi');
var app = require('../app');

var MapView = Backbone.View.extend({
  el: '#map', 

  template: require('../../templates/map.hbs'),

  initialize: function () {
    // this.listenTo(this.collection, 'reset', this.render);
    this.listenTo(this.collection, 'add', this.addmarker);
    this.render();
  },

  // Render the view with a default map location and grabs data from yelp api and puts it into collection for bar and food w/ address 
  render: function () {
    google.maps.event.addDomListener(window, 'onload', this.initialize);
        
    this.$el.html(this.template());

    // This sets the intial map location on page load
    var latlng = new google.maps.LatLng(45.5200, -122.6819);

    var mapOptions = {
      zoom: 13,
      center: latlng
    };

    this.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    var address = document.getElementById('address').value;

    app.collections.businesses.reset();

    yelpapi('bar', address);
    yelpapi('food', address);

    var collectionstorage = {};
    collectionstorage.businesses = this.collection.where({type: "food"}) || null;
    console.log(collectionstorage.businesses);
    // this.codeAddress(address) 
  },

  // On button click call codeAddress
  events: {
    "click .geocode": "render",
  },

  // Transform the address to a location using Google's API

  addmarker: function() {
    var drinkstorage = {};
    drinkstorage.drink = this.collection.get() || null;
    console.log(drinkstorage.drink);
  },

  codeAddress: function(address) {
    console.log("Button Clicked");

    // var address = address.toString();
    // var geocoder = new google.maps.Geocoder();

    // //Set latlng for user address center's map on address 
    // geocoder.geocode( { 'address': address}, function(results, status) {
    //   if (status == google.maps.GeocoderStatus.OK) {
    //     map.setCenter(results[0].geometry.location);
    //     var marker = new google.maps.Marker({
    //         map: map,
    //         position: results[0].geometry.location
    //     });
    //   } else {
    //     alert('Search was not successful for the following reason: ' + status);
    //   }
    // });

    // // Pulls data from model for bar
    // var drinkstorage = {}
    // drinkstorage.drink = this.model.get('drink') || null
    // drinkstorage.drinkadd = this.model.get('drinkadd') || null

    // console.log("Before the empty data test");
    // if(!drinkstorage.drinkadd) return this;
    // console.log("After the empty data test");

    // // Pulls data from model for food
    // var foodstorage = {}
    // foodstorage.food = this.model.get('food') || null
    // foodstorage.foodadd = this.model.get('foodadd') || null

    // // Create the info window box
    // var drinkcontentString = '<div id="content">'+
    //   '<p>'+ drinkstorage.drink +'</p>' + '<p>'+ drinkstorage.drinkadd +'</p>'+'</div>';

    // var foodcontentString = '<div id="content">'+
    //   '<p>'+ foodstorage.food +'</p>' + '<p>'+ foodstorage.foodadd +'</p>'+'</div>';

    // var drinkinfowindow = new google.maps.InfoWindow({
    //   content: drinkcontentString
    // });

    // var foodinfowindow = new google.maps.InfoWindow({
    //   content: foodcontentString
    // });
    
    // // Set address to bar    
    // address = drinkstorage.drinkadd 

    // // set latlng for address of bar
    // geocoder.geocode( { 'address': address}, function(results, status) {
    //   if (status == google.maps.GeocoderStatus.OK) {
    //     var marker = new google.maps.Marker({
    //         map: map,
    //         position: results[0].geometry.location
    //     });
    //     drinkinfowindow.open(map,marker);
    //   } else {
    //     alert('Search was not successful for the following reason: ' + status);
    //   }
    // });

    // // Set address to food  
    // address = foodstorage.foodadd
    // // set latlng for address of food
    // geocoder.geocode( { 'address': address}, function(results, status) {
    //   if (status == google.maps.GeocoderStatus.OK) {
    //     var marker = new google.maps.Marker({
    //         map: map,
    //         position: results[0].geometry.location
    //     });
    //     foodinfowindow.open(map,marker);
    //   } else {
    //     alert('Search was not successful for the following reason: ' + status);
    //   }
    // });

  // return this;

  },

});

module.exports = MapView;