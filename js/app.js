const CLIENT_ID = 'GOCIDB0RL50MCE2X3G2DYRDXRAA1AMG2XF3R3ZJBRRXSNECL';
const CLIENT_SECRET = 'FX40PY51ZXGKUH04AWKQAXOUY3KIYSH1OCYNBHQWEY4OZ10N';

var loc, map, results;

function panMapResult(lat, lon) {
  map.panTo([lat, lon]);
}

function selectLocation() {
  var index = $(this).data('recommendation');
  var venue = results[index].venue;
  var lat = venue.location['lat'];
  var lon = venue.location['lng'];

  venue.marker.openPopup();

  panMapResult(lat, lon);
}

$('#results').on('click', '.listing', selectLocation);

function drawResults(callback) {
  L.circle(loc, 200).addTo(map);

  $.getJSON(
    'https://api.foursquare.com/v2/venues/explore?ll=' +
      loc['lat'] +
      ',' +
      loc['lon'] +
      '&section=coffee&limit=50&radius=8000&sortByDistance=1&venuePhotos=1&client_id=' +
      CLIENT_ID +
      '&client_secret=' +
      CLIENT_SECRET +
      '&v=20161115',
    function(data) {
      results = $.grep(data.response.groups[0].items, function(recommendation) {
        return recommendation.venue.categories[0].id ===
          '4bf58dd8d48988d16d941735' ||
          recommendation.venue.categories[0].id === '4bf58dd8d48988d1e0931735';
      }).slice(0, 10);
      // if(results.length !== 0) {
      //   $('.js-query').text("testing");
      // }
      $.each(results, function(i, recommendation) {
        var lat = recommendation.venue.location.lat;
        var lon = recommendation.venue.location.lng;
        photos = recommendation.venue.photos.groups[0].items[0];
        directionsUrl = 'https://www.google.com/maps/dir/' +
          loc.lat +
          ',' +
          loc.lon +
          '/' +
          lat +
          ',' +
          lon;
        content = $(
          '<li class="listing"><div class="venue"><div class="photo" style="background:url(' +
            photos.prefix +
            'width400' +
            photos.suffix +
            ') center center"><h1>' +
            recommendation.venue.name +
            '</h1></div><a href="' +
            directionsUrl +
            '" class="directions">Go</a><div class="details"><address>' +
            recommendation.venue.location.address +
            '<br>' +
            recommendation.venue.location.city +
            ', ' +
            recommendation.venue.location.state +
            ' ' +
            recommendation.venue.location.postalCode +
            '</address></div></div></li>'
        );
        content.data('recommendation', i);

        recommendation.venue.marker = L.marker([lat, lon]).addTo(map);
        recommendation.venue.marker.bindPopup(
          '<strong>' +
            recommendation.venue.name +
            '</strong><br><a href="' +
            directionsUrl +
            '" class="directions-text">Get directions here</a>'
        );

        content.appendTo('#results');
      });
    }
  );

  callback();
}

// ip api fallback

function getGeoLocation() {
  navigator.geolocation.getCurrentPosition(function(position) {
    loc = {
      lat: position.coords.latitude,
      lon: position.coords.longitude
    };
    map = L.map('map').setView(
      [position.coords.latitude, position.coords.longitude],
      13
    );

    L.tileLayer(
      'https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVtYXJrcyIsImEiOiJjaXYxeTR0aXQwMGpzMnpvZTJwajZ6c3E5In0.wcSJhHXVS25LJuN744wlpA',
      {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18
      }
    ).addTo(map);
  });
}

function randomizeBg() {
  var images = ['photo-1.jpeg', 'photo-2.jpeg', 'photo-3.jpeg', 'photo-4.jpeg'];
  $('.search').css({
    'background-image': 'url(img/' +
      images[Math.floor(Math.random() * images.length)] +
      ')'
  });
}

$('button').on('click', function(e) {
  e.preventDefault();
  drawResults(function() {
    console.log('');
  });
  $('#search').addClass('hide');
});

$(function() {
  getGeoLocation();
});
