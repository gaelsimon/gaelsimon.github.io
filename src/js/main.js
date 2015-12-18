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

