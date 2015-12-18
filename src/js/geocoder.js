var Data = require('./data');
var stores = [];

var Geocoder = function (map, marker_url, callback) {
    this.geocodePOI(Data.getDataSource().bars, map, marker_url, callback);

};

Geocoder.prototype.geocodePOI = function (data, map, marker_url, callback) {
    var self = this;
    var delay = 1000;
    var googleGeocoder = new google.maps.Geocoder();
    for (var i = 0; i < data.length; i++) {
        setTimeout(
            (function (poi, index) {
                return function () {
                    self.geocode(poi[index], index, googleGeocoder, map, marker_url);
                    if (index === poi.length - 1) {
                        setTimeout(callback(stores), 1000);
                    }
                }
            })(data, i), delay);
        delay += 1000;
    }
};

Geocoder.prototype.geocode = function (poi, index, geocoder, map, marker_url) {
    var self = this;
    var address = poi.address + ", " + poi.city;
    geocoder.geocode({'address': address}, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var feature = {
                type: 'Feature',
                properties: results,
                data_properties: poi,
                id:index,
                formatted_address: results[0].formatted_address,
                position: new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng())
            };
            stores.push(feature);
            self.displayMarker(feature, map, marker_url);
        }
        else if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
            console.log("over_query_limit");
            return {};
        }
        else {
            console.log("error_geocoding_data");
            return {};
        }
    });
};
Geocoder.prototype.displayMarker = function (geocodedAddress, map, marker_url) {
    var options = {
        map: map,
        icon: marker_url,
        position: geocodedAddress.position,
        animation: google.maps.Animation.DROP
    };
    var marker = new google.maps.Marker(options);
    marker.setVisible(true);
};

module.exports = Geocoder;
