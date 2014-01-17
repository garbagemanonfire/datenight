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
    
    var drinkstorage = {}
    drinkstorage.drink = this.model.get('drink') || null
    drinkstorage.drinkadd = this.model.get('drinkadd') || null

    var foodstorage = {}
    foodstorage.food = this.model.get('food') || null
    foodstorage.foodadd = this.model.get('foodadd') || null

    var context = {}
    context.businesses = this.model.get('businesses') || null;
    this.$el.html(this.template(context));
    var latlng = new google.maps.LatLng(45.5200, -122.6819);
    var mapOptions = {
      zoom: 13,
      center: latlng
    }

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    
    if(!context.businesses) return this; // STAHP!!!

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

    var marker = new google.maps.Marker({
      position: latlng,
      map: map,
      title: ''
    });
    
    drinkinfowindow.open(map,marker);
    foodinfowindow.open(map,marker);

    return this;
  },

// On button click call codeAddress
  events: {
    "click .geocode": "yelpDatapass",
  },

  yelpDatapass: function(){
    var drinkstorage = {}
    drinkstorage.drinkadd = this.model.get('drinkadd') || null
    this.codeAddress(drinkstorage.drinkadd);
  },


// Transform the address to a location using Google's API
  codeAddress: function(x) {
    console.log("Button Clicked");
    var address = x.toString();
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
  },

});

module.exports = MapView;