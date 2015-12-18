jQuery(document).ready(function ($) {
    var latitude = 44.218895,
        longitude = 3.676595,
        map_zoom = 10;

    var is_internetExplorer11 = navigator.userAgent.toLowerCase().indexOf('trident') > -1;
    var marker_url = ( is_internetExplorer11 ) ? 'img/default_marker.png' : 'img/default_marker.svg';

    var main_color = '#149DB5',
        saturation_value = -20,
        brightness_value = 5;

    var style = [
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
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(latitude, longitude),
        map: map,
        visible: true,
        icon: marker_url
    });

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
    map.controls[google.maps.ControlPosition.LEFT_TOP].push(maptypeControlDiv);

    var geocoder = new google.maps.Geocoder();
    var delay = 100;

});

