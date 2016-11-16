// https://api.foursquare.com/v2/venues/search?near=Northridge,+CA&query=mcdonalds&limit=10&client_id=GOCIDB0RL50MCE2X3G2DYRDXRAA1AMG2XF3R3ZJBRRXSNECL&client_secret=FX40PY51ZXGKUH04AWKQAXOUY3KIYSH1OCYNBHQWEY4OZ10N&v=20161110
// AIzaSyA6A_ZqMsyzbR0ZHE-j8SScXUyqqTVgFxE

// https://api.foursquare.com/v2/venues/explore?near=Northridge,+CA&query=mcdonalds&limit=10&venuePhotos=1&client_id=GOCIDB0RL50MCE2X3G2DYRDXRAA1AMG2XF3R3ZJBRRXSNECL&client_secret=FX40PY51ZXGKUH04AWKQAXOUY3KIYSH1OCYNBHQWEY4OZ10N&v=20161110

const CLIENT_ID = 'GOCIDB0RL50MCE2X3G2DYRDXRAA1AMG2XF3R3ZJBRRXSNECL';
const CLIENT_SECRET = 'FX40PY51ZXGKUH04AWKQAXOUY3KIYSH1OCYNBHQWEY4OZ10N';

var loc,
  map,
  results;

function panMapResult(lat, lon) {
  map.panTo([lat, lon]);
}

function selectLocation() {
  var index = $(this).data('venue');
  var venue = results[index].venue;
  var lat = venue.location["lat"];
  var lon = venue.location["lng"];

  venue.marker.openPopup();

  panMapResult(lat, lon);
}

$('#results').on('click', '.listing', selectLocation);

function drawResults() {
  L.circle(loc, 200).addTo(map);

  $.getJSON('https://api.foursquare.com/v2/venues/explore?ll=' + loc + '&section=coffee&limit=10&venuePhotos=1&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET + '&v=20161115',
  function(data) {
    results = data.response.groups[0].items;
    $.each(results, function(i, v){ // index + data
      photos = v.venue.photos.groups[0].items[0];
      content = $('<li class="listing"><div class="venue"><div class="photo"><img src="' + photos.prefix
        + "width400" + photos.suffix + '"></div><div class="details">' +
        v.venue.name + '<br><address>' + v.venue.location["address"] + '</address></div></div></li>'
      );
      content.data('venue', i);
      var lat = v.venue.location.lat;
      var lon = v.venue.location.lng;

      v.venue.marker = L.marker([lat, lon]).addTo(map);
      v.venue.marker.bindPopup(v.venue.name);

      content.appendTo("#results");
    });
  });
}

function getGeoLocation() {
  navigator.geolocation.getCurrentPosition(function(position) {
    loc = [position.coords.latitude, position.coords.longitude];
    drawMap(position.coords.latitude, position.coords.longitude);
  })
}

function getIpLocation() {
  $.getJSON("https://freegeoip.net/json/", function(data) {
    $('.js-location').val(data.city + ', ' + data.region_code);
  });
}

function drawMap(lat, lon) {
  map = L.map('map').setView([lat, lon], 14);

  L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVtYXJrcyIsImEiOiJjaXYxeTR0aXQwMGpzMnpvZTJwajZ6c3E5In0.wcSJhHXVS25LJuN744wlpA', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18
  }).addTo(map);

}

function startPage() {
//  getIpLocation();
  getGeoLocation();
}

$('button').on('click', function(e) {
  getGeoLocation();
  e.preventDefault();
  $('.search').addClass('hide');

  drawResults();
});

$(function() {
  startPage();
});