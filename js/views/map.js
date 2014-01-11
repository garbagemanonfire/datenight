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
    var context = {}
    context.businesses = this.model.get('businesses') || null;
    this.$el.html(this.template(context));
    var latlng = new google.maps.LatLng(45.5200, -122.6819);
    var mapOptions = {
      zoom: 12,
      center: latlng
    }
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    
    if(!context.businesses) return this; // STAHP!!!

    console.log(context)
    var contentString = '<div id="content">'+
      '<h5 class="firstHeading">'+ context.businesses[0].location.address +'</h5>'+
      '<p>Address'+
      '</p>'+
      '</div>';

    var infowindow = new google.maps.InfoWindow({
      content: contentString
    });

    var marker = new google.maps.Marker({
      position: latlng,
      map: map,
      title: 'Hello World!'
    });
    
    infowindow.open(map,marker);

    return this;
  },

// On button click call codeAddress
  events: {
    "click .geocode": "yelpDatapass",
  },

  yelpDatapass: function(){
    var context = {}
    context.businesses = this.model.get('businesses') || {};
    var test = context.businesses[0].location.address +" "+ context.businesses[0].location.city;
    var test1 = context.businesses[1].location.address +" "+ context.businesses[1].location.city;
    this.codeAddress(test);
    console.log(test1)
    this.codeAddress(test1);
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