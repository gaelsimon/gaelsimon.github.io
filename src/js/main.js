var MapStyle = require('./mapstyle');
var AutoComplete = require('./autocomplete');
var Geocoder = require('./geocoder');
var BoundsManager = require('./boundsmanager');
var ListPanel = require('./listpanel');

window.initMap = function () {
    var latitude = 43.610430,
        longitude = 3.875395,
        map_zoom = 8;
    var pointsOfInterest = [];
    var userPosition = {};
    var is_internetExplorer11 = navigator.userAgent.toLowerCase().indexOf('trident') > -1;
    var marker_url = ( is_internetExplorer11 ) ? 'img/default_marker.png' : 'img/default_marker.svg';
    var marker_search = ( is_internetExplorer11 ) ? 'img/location.png' : 'img/location.svg';
    var marker_user = ( is_internetExplorer11 ) ? 'img/marker_user.png' : 'img/marker_user.svg';
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
    var mapContainer = document.getElementById('google-container');
    var map = new google.maps.Map(mapContainer, map_options);

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

    var searchPlace = new AutoComplete(map, marker_search);
    var geocoder = new Geocoder(map, marker_url, function (stores) {
        pointsOfInterest = stores;
        GetUserLocation();
    });

    function getBounds(features) {
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < features.length; i++) {
            bounds.extend(features[i].position);
        }
        pointsOfInterest.pop();
        return bounds;
    }

    function GetUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var location = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                userPosition = location;
                var marker = new google.maps.Marker({
                    position: location,
                    map: map,
                    icon: marker_user
                });
                marker.setVisible(true);
                zoomToDataAndUserLocation(marker);
            }, function () {
                alert("Error in Geo-Location");
            });
        } else {
            alert("no supported Geo-Location");
        }
    }

    function zoomToDataAndUserLocation(markerUser) {
        var computedStyle = window.getComputedStyle(mapContainer);

        var boundsManager = new BoundsManager({
            mapHeight: parseFloat(computedStyle.height),
            mapWidth: parseFloat(computedStyle.width),
            padding: {left: 300}
        });
        pointsOfInterest.push(markerUser);
        var centerAndZoom = boundsManager.getBoundsCenterAndZoom(getBounds(pointsOfInterest));

        map.setCenter(centerAndZoom.center);
        map.setZoom(centerAndZoom.zoom);
        computeDistancesFrom(markerUser.position);
    }

    function computeListPanel() {
        var listPanel = new ListPanel(mapContainer);
        pointsOfInterest.sort(function (a, b) {
            if (a.distance > b.distance)
                return 1;
            if (a.distance < b.distance)
                return -1;
            return 0;
        });
        var closest5 = pointsOfInterest.slice(0, 5);
        listPanel.render(closest5);
        listPanel.setVisible(true);

        for (var i = 0; i < closest5.length; i++) {
            $('#btn-' + i).on("click", function () {
                calculateItinary(closest5[$(this).data("id")].position);
            });
        }
    }

    function computeDistancesFrom(location) {
        var destinations = [];
        for (var i = 0; i < pointsOfInterest.length; i++) {
            destinations.push(pointsOfInterest[i].position);
        }
        var matrixRequest = {
            origins: [{location: location}],
            destinations: destinations,
            travelMode: google.maps.TravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem.METRIC
        };
        var distanceMatrix = new google.maps.DistanceMatrixService();
        distanceMatrix.getDistanceMatrix(matrixRequest, function (response, status) {
            if (status == google.maps.DistanceMatrixStatus.OK) {
                for (var i = 0; i < response.rows[0].elements.length; i++) {
                    pointsOfInterest[i].properties.distance = response.rows[0].elements[i].distance.value;
                    pointsOfInterest[i].properties.distancetext = response.rows[0].elements[i].distance.text;
                    pointsOfInterest[i].properties.duration = response.rows[0].elements[i].duration.text;
                    if (i == response.rows[0].elements.length - 1) {
                        computeListPanel();
                    }
                }
            }
            else {
                console.log("error distance matrix");
            }
        });
    }

    function calculateItinary(destination) {
        var request = {
            origin: userPosition,
            destination: destination,
            travelMode: google.maps.TravelMode.DRIVING
        };
        var dDisplay = new google.maps.DirectionsRenderer({draggable: true, preserveViewport:true});
        dDisplay.setPanel(document.getElementById("list-panel"));
        var directionsService = new google.maps.DirectionsService();
        directionsService.route(request, function (result, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                $("#list-panel").empty();
                dDisplay.setMap(map);
                dDisplay.setDirections(result);
            }
        });
    }
};

