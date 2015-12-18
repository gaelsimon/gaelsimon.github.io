var originShift = 2.0 * Math.PI * 6378137.0 / 2.0;
var initialResolution = 2.0 * Math.PI * 6378137.0 / 256.0;


var _toPixel = function (meterPoint, resolution) {
    return new google.maps.Point(
        (meterPoint.x + originShift) / resolution,
        (meterPoint.y + originShift) / resolution);
};

var _toMeter = function (pixelPoint, resolution) {
    return new google.maps.Point(
        (pixelPoint.x * resolution) - originShift,
        (pixelPoint.y * resolution) - originShift);
};

var _toLatLng = function(point) {
    var lng = (point.x / originShift) * 180.0;
    var lat = (point.y / originShift) * 180.0;

    lat = 180 / Math.PI * (2 * Math.atan(Math.exp(lat * Math.PI / 180.0)) - Math.PI / 2.0);

    return new google.maps.LatLng(lat, lng)
};

var _fromLatLng = function(latLng) {
    var mx = latLng.lng() * originShift / 180.0;
    var my = Math.log(Math.tan((90 + latLng.lat()) * Math.PI / 360.0)) / (Math.PI / 180.0);

    my = my * originShift / 180.0;

    return new google.maps.Point(mx, my);
};



var UNITS = {
    meter: 'meter',
    pixel: 'pixel'
};

var fromLatLngBounds = function (latLngBounds) {
    var retVal = new SphericalBounds(
        _fromLatLng(latLngBounds.getSouthWest()),
        _fromLatLng(latLngBounds.getNorthEast())
    );

    retVal.unit = UNITS.meter;

    return retVal;
};

var SphericalBounds = function (sw, ne) {
    this.sw = sw;
    this.ne = ne;
    this.unit = UNITS.meter
};

SphericalBounds.prototype._convert = function (zoom, lambda, inner) {
    if (this.unit == inner) {
        throw "These bouds are already in " + inner;
    }

    var resolution = initialResolution / Math.pow(2, zoom);
    var retVal = new SphericalBounds(
        lambda(this.sw, resolution),
        lambda(this.ne, resolution)
    );

    retVal.unit = inner;
    return retVal;
};

SphericalBounds.prototype.toPixel = function (zoom) {
    return this._convert(zoom, _toPixel, UNITS.pixel);

};

SphericalBounds.prototype.toMeter = function (zoom) {
    return this._convert(zoom, _toMeter, UNITS.meter);
};


SphericalBounds.prototype.toLatLngBounds = function(zoom) {
    if (this.unit == UNITS.pixel) {
        if (!zoom) {
            throw 'zoom must be supplied in order to convert to latLngBounds';
        }
        return this.toMeter(zoom).toLatLngBounds();
    }
    else {
        return new google.maps.LatLngBounds(
            _toLatLng(this.sw),
            _toLatLng(this.ne)
        )
    }
};

exports.SphericalBounds = SphericalBounds;
exports.fromLatLngBounds = fromLatLngBounds;