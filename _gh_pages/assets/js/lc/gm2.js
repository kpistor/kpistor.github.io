var map;
// var sf = new google.maps.LatLng(37.780361, -122.413396);
var sf = new google.maps.LatLng(36.149677, -115.113545);



var MY_MAPTYPE_ID = 'custom_style';



function initialize() {

  var featureOpts = [
    {
      stylers: [
        { hue: '#c1b09b' },
        { visibility: 'simplified' },
        { gamma: 0.5 },
        { weight: 0.5 }
      ]
    },
    {
      elementType: 'labels',
      stylers: [
        { visibility: 'on' }
      ]
    },
    {
      featureType: 'water',
      stylers: [
        { color: '#c1b09b' }
      ]
    }
  ];

  var mapOptions = {
    zoom: 6,
    center: sf,
    zoomControl: false,
    scaleControl: false,
    scrollwheel: false,
    streetViewControl: false,
    disableDoubleClickZoom: true,
    mapTypeControlOptions: {
      mapTypeIds: [google.maps.MapTypeId.ROADMAP, MY_MAPTYPE_ID]
    },
    mapTypeId: MY_MAPTYPE_ID
  };

  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

  var styledMapOptions = {
    name: 'Custom Style'
  };

  var customMapType = new google.maps.StyledMapType(featureOpts, styledMapOptions);

  map.mapTypes.set(MY_MAPTYPE_ID, customMapType);



}

google.maps.event.addDomListener(window, 'load', initialize);