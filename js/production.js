(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var AutoComplete = function (map) {
    var searchInput = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(searchInput);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(searchInput);
    this.registerEvent(map, searchBox);
    return {};
};

AutoComplete.prototype.registerEvent = function (map, searchBox) {
    var markers = [];
    var is_internetExplorer11 = navigator.userAgent.toLowerCase().indexOf('trident') > -1;
    var marker_url = ( is_internetExplorer11 ) ? 'img/default_marker.png' : 'img/default_marker.svg';

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function () {
        searchBox.setBounds(map.getBounds());
    });
    // [START region_getplaces]
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function () {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        // Clear out the old markers.
        markers.forEach(function (marker) {
            marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
                map: map,
                icon: marker_url,
                title: place.name,
                position: place.geometry.location
            }));

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });
};
module.exports = AutoComplete;

},{}],2:[function(require,module,exports){
var MapStyle = require('./mapstyle');
var AutoComplete = require('./autocomplete');

window.initMap = function () {
    var latitude = 44.218895,
        longitude = 3.676595,
        map_zoom = 10;

    var style = MapStyle.getStyle();
    var map_options = {
        center: new google.maps.LatLng(latitude, longitude),
        zoom: map_zoom,
        panControl: false,
        zoomControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        mapTypeId: google.maps.MapTypeId.TERRAIN,
        scrollwheel: false,
        styles: style
    };
    var map = new google.maps.Map(document.getElementById('google-container'), map_options);

    function CustomZoomControl(controlDiv, map) {
        var controlUIzoomIn = document.getElementById('zoom-in'),
            controlUIzoomOut = document.getElementById('zoom-out');
        controlDiv.appendChild(controlUIzoomIn);
        controlDiv.appendChild(controlUIzoomOut);

        google.maps.event.addDomListener(controlUIzoomIn, 'click', function () {
            map.setZoom(map.getZoom() + 1)
        });
        google.maps.event.addDomListener(controlUIzoomOut, 'click', function () {
            map.setZoom(map.getZoom() - 1)
        });
    }

    function CustomBasemapControl(controlDiv, map) {
        var controlMap = document.getElementById('map-control'),
            controlSatellite = document.getElementById('satellite-control');
        controlDiv.appendChild(controlMap);
        controlDiv.appendChild(controlSatellite);

        google.maps.event.addDomListener(controlMap, 'click', function () {
            map.setMapTypeId(google.maps.MapTypeId.TERRAIN);
        });
        google.maps.event.addDomListener(controlSatellite, 'click', function () {
            map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
        });
    }

    var zoomControlDiv = document.createElement('div');
    var maptypeControlDiv = document.createElement('div');
    var zoomControl = new CustomZoomControl(zoomControlDiv, map);
    var maptypeControl = new CustomBasemapControl(maptypeControlDiv, map);

    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(zoomControlDiv);
    map.controls[google.maps.ControlPosition.RIGHT_TOP].push(maptypeControlDiv);

    var searchPlace = new AutoComplete(map);

};


},{"./autocomplete":1,"./mapstyle":3}],3:[function(require,module,exports){
module.exports = {
    getStyle: function () {

        var main_color = '#149DB5',
            saturation_value = -20,
            brightness_value = 5;

        return [
            {
                elementType: "labels",
                stylers: [
                    {saturation: saturation_value}
                ]
            },
            {
                featureType: "poi",
                elementType: "labels",
                stylers: [
                    {visibility: "off"}
                ]
            },
            {
                //don't show highways lables on the map
                featureType: 'road.highway',
                elementType: 'labels',
                stylers: [
                    {visibility: "off"}
                ]
            },
            {
                //don't show local road lables on the map
                featureType: "road.local",
                elementType: "labels.icon",
                stylers: [
                    {visibility: "off"}
                ]
            },
            {
                featureType: "road.arterial",
                elementType: "labels.icon",
                stylers: [
                    {visibility: "off"}
                ]
            },
            {
                featureType: "road",
                elementType: "geometry.stroke",
                stylers: [
                    {visibility: "off"}
                ]
            },
            {
                featureType: "transit",
                elementType: "geometry.fill",
                stylers: [
                    {hue: main_color},
                    {visibility: "on"},
                    {lightness: brightness_value},
                    {saturation: saturation_value}
                ]
            },
            {
                featureType: "poi",
                elementType: "geometry.fill",
                stylers: [
                    {hue: main_color},
                    {visibility: "on"},
                    {lightness: brightness_value},
                    {saturation: saturation_value}
                ]
            },
            {
                featureType: "poi.government",
                elementType: "geometry.fill",
                stylers: [
                    {hue: main_color},
                    {visibility: "on"},
                    {lightness: brightness_value},
                    {saturation: saturation_value}
                ]
            },
            {
                featureType: "poi.sport_complex",
                elementType: "geometry.fill",
                stylers: [
                    {hue: main_color},
                    {visibility: "on"},
                    {lightness: brightness_value},
                    {saturation: saturation_value}
                ]
            },
            {
                featureType: "poi.attraction",
                elementType: "geometry.fill",
                stylers: [
                    {hue: main_color},
                    {visibility: "on"},
                    {lightness: brightness_value},
                    {saturation: saturation_value}
                ]
            },
            {
                featureType: "poi.business",
                elementType: "geometry.fill",
                stylers: [
                    {hue: main_color},
                    {visibility: "on"},
                    {lightness: brightness_value},
                    {saturation: saturation_value}
                ]
            },
            {
                featureType: "transit",
                elementType: "geometry.fill",
                stylers: [
                    {hue: main_color},
                    {visibility: "on"},
                    {lightness: brightness_value},
                    {saturation: saturation_value}
                ]
            },
            {
                featureType: "transit.station",
                elementType: "geometry.fill",
                stylers: [
                    {hue: main_color},
                    {visibility: "on"},
                    {lightness: brightness_value},
                    {saturation: saturation_value}
                ]
            },
            {
                featureType: "landscape",
                stylers: [
                    {hue: main_color},
                    {visibility: "on"},
                    {lightness: brightness_value},
                    {saturation: saturation_value}
                ]

            },
            {
                featureType: "road",
                elementType: "geometry.fill",
                stylers: [
                    {hue: main_color},
                    {visibility: "on"},
                    {lightness: brightness_value},
                    {saturation: saturation_value}
                ]
            },
            {
                featureType: "road.highway",
                elementType: "geometry.fill",
                stylers: [
                    {hue: main_color},
                    {visibility: "on"},
                    {lightness: brightness_value},
                    {saturation: saturation_value}
                ]
            },
            {
                featureType: "water",
                elementType: "geometry",
                stylers: [
                    {hue: main_color},
                    {visibility: "on"},
                    {lightness: brightness_value},
                    {saturation: saturation_value}
                ]
            }
        ];
    }
};

},{}]},{},[2])