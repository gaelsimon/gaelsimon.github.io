(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = require('./lib/extend');


},{"./lib/extend":2}],2:[function(require,module,exports){
/*!
 * node.extend
 * Copyright 2011, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * @fileoverview
 * Port of jQuery.extend that actually works on node.js
 */
var is = require('is');

function extend() {
  var target = arguments[0] || {};
  var i = 1;
  var length = arguments.length;
  var deep = false;
  var options, name, src, copy, copy_is_array, clone;

  // Handle a deep copy situation
  if (typeof target === 'boolean') {
    deep = target;
    target = arguments[1] || {};
    // skip the boolean and the target
    i = 2;
  }

  // Handle case when target is a string or something (possible in deep copy)
  if (typeof target !== 'object' && !is.fn(target)) {
    target = {};
  }

  for (; i < length; i++) {
    // Only deal with non-null/undefined values
    options = arguments[i]
    if (options != null) {
      if (typeof options === 'string') {
          options = options.split('');
      }
      // Extend the base object
      for (name in options) {
        src = target[name];
        copy = options[name];

        // Prevent never-ending loop
        if (target === copy) {
          continue;
        }

        // Recurse if we're merging plain objects or arrays
        if (deep && copy && (is.hash(copy) || (copy_is_array = is.array(copy)))) {
          if (copy_is_array) {
            copy_is_array = false;
            clone = src && is.array(src) ? src : [];
          } else {
            clone = src && is.hash(src) ? src : {};
          }

          // Never move original objects, clone them
          target[name] = extend(deep, clone, copy);

        // Don't bring in undefined values
        } else if (typeof copy !== 'undefined') {
          target[name] = copy;
        }
      }
    }
  }

  // Return the modified object
  return target;
};

/**
 * @public
 */
extend.version = '1.1.3';

/**
 * Exports module.
 */
module.exports = extend;


},{"is":3}],3:[function(require,module,exports){
/* globals window, HTMLElement */
/**!
 * is
 * the definitive JavaScript type testing library
 *
 * @copyright 2013-2014 Enrico Marino / Jordan Harband
 * @license MIT
 */

var objProto = Object.prototype;
var owns = objProto.hasOwnProperty;
var toStr = objProto.toString;
var symbolValueOf;
if (typeof Symbol === 'function') {
  symbolValueOf = Symbol.prototype.valueOf;
}
var isActualNaN = function (value) {
  return value !== value;
};
var NON_HOST_TYPES = {
  'boolean': 1,
  number: 1,
  string: 1,
  undefined: 1
};

var base64Regex = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/;
var hexRegex = /^[A-Fa-f0-9]+$/;

/**
 * Expose `is`
 */

var is = module.exports = {};

/**
 * Test general.
 */

/**
 * is.type
 * Test if `value` is a type of `type`.
 *
 * @param {Mixed} value value to test
 * @param {String} type type
 * @return {Boolean} true if `value` is a type of `type`, false otherwise
 * @api public
 */

is.a = is.type = function (value, type) {
  return typeof value === type;
};

/**
 * is.defined
 * Test if `value` is defined.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if 'value' is defined, false otherwise
 * @api public
 */

is.defined = function (value) {
  return typeof value !== 'undefined';
};

/**
 * is.empty
 * Test if `value` is empty.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is empty, false otherwise
 * @api public
 */

is.empty = function (value) {
  var type = toStr.call(value);
  var key;

  if (type === '[object Array]' || type === '[object Arguments]' || type === '[object String]') {
    return value.length === 0;
  }

  if (type === '[object Object]') {
    for (key in value) {
      if (owns.call(value, key)) { return false; }
    }
    return true;
  }

  return !value;
};

/**
 * is.equal
 * Test if `value` is equal to `other`.
 *
 * @param {Mixed} value value to test
 * @param {Mixed} other value to compare with
 * @return {Boolean} true if `value` is equal to `other`, false otherwise
 */

is.equal = function equal(value, other) {
  if (value === other) {
    return true;
  }

  var type = toStr.call(value);
  var key;

  if (type !== toStr.call(other)) {
    return false;
  }

  if (type === '[object Object]') {
    for (key in value) {
      if (!is.equal(value[key], other[key]) || !(key in other)) {
        return false;
      }
    }
    for (key in other) {
      if (!is.equal(value[key], other[key]) || !(key in value)) {
        return false;
      }
    }
    return true;
  }

  if (type === '[object Array]') {
    key = value.length;
    if (key !== other.length) {
      return false;
    }
    while (--key) {
      if (!is.equal(value[key], other[key])) {
        return false;
      }
    }
    return true;
  }

  if (type === '[object Function]') {
    return value.prototype === other.prototype;
  }

  if (type === '[object Date]') {
    return value.getTime() === other.getTime();
  }

  return false;
};

/**
 * is.hosted
 * Test if `value` is hosted by `host`.
 *
 * @param {Mixed} value to test
 * @param {Mixed} host host to test with
 * @return {Boolean} true if `value` is hosted by `host`, false otherwise
 * @api public
 */

is.hosted = function (value, host) {
  var type = typeof host[value];
  return type === 'object' ? !!host[value] : !NON_HOST_TYPES[type];
};

/**
 * is.instance
 * Test if `value` is an instance of `constructor`.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an instance of `constructor`
 * @api public
 */

is.instance = is['instanceof'] = function (value, constructor) {
  return value instanceof constructor;
};

/**
 * is.nil / is.null
 * Test if `value` is null.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is null, false otherwise
 * @api public
 */

is.nil = is['null'] = function (value) {
  return value === null;
};

/**
 * is.undef / is.undefined
 * Test if `value` is undefined.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is undefined, false otherwise
 * @api public
 */

is.undef = is.undefined = function (value) {
  return typeof value === 'undefined';
};

/**
 * Test arguments.
 */

/**
 * is.args
 * Test if `value` is an arguments object.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an arguments object, false otherwise
 * @api public
 */

is.args = is.arguments = function (value) {
  var isStandardArguments = toStr.call(value) === '[object Arguments]';
  var isOldArguments = !is.array(value) && is.arraylike(value) && is.object(value) && is.fn(value.callee);
  return isStandardArguments || isOldArguments;
};

/**
 * Test array.
 */

/**
 * is.array
 * Test if 'value' is an array.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an array, false otherwise
 * @api public
 */

is.array = Array.isArray || function (value) {
  return toStr.call(value) === '[object Array]';
};

/**
 * is.arguments.empty
 * Test if `value` is an empty arguments object.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an empty arguments object, false otherwise
 * @api public
 */
is.args.empty = function (value) {
  return is.args(value) && value.length === 0;
};

/**
 * is.array.empty
 * Test if `value` is an empty array.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an empty array, false otherwise
 * @api public
 */
is.array.empty = function (value) {
  return is.array(value) && value.length === 0;
};

/**
 * is.arraylike
 * Test if `value` is an arraylike object.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an arguments object, false otherwise
 * @api public
 */

is.arraylike = function (value) {
  return !!value && !is.bool(value)
    && owns.call(value, 'length')
    && isFinite(value.length)
    && is.number(value.length)
    && value.length >= 0;
};

/**
 * Test boolean.
 */

/**
 * is.bool
 * Test if `value` is a boolean.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is a boolean, false otherwise
 * @api public
 */

is.bool = is['boolean'] = function (value) {
  return toStr.call(value) === '[object Boolean]';
};

/**
 * is.false
 * Test if `value` is false.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is false, false otherwise
 * @api public
 */

is['false'] = function (value) {
  return is.bool(value) && Boolean(Number(value)) === false;
};

/**
 * is.true
 * Test if `value` is true.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is true, false otherwise
 * @api public
 */

is['true'] = function (value) {
  return is.bool(value) && Boolean(Number(value)) === true;
};

/**
 * Test date.
 */

/**
 * is.date
 * Test if `value` is a date.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is a date, false otherwise
 * @api public
 */

is.date = function (value) {
  return toStr.call(value) === '[object Date]';
};

/**
 * Test element.
 */

/**
 * is.element
 * Test if `value` is an html element.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an HTML Element, false otherwise
 * @api public
 */

is.element = function (value) {
  return value !== undefined
    && typeof HTMLElement !== 'undefined'
    && value instanceof HTMLElement
    && value.nodeType === 1;
};

/**
 * Test error.
 */

/**
 * is.error
 * Test if `value` is an error object.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an error object, false otherwise
 * @api public
 */

is.error = function (value) {
  return toStr.call(value) === '[object Error]';
};

/**
 * Test function.
 */

/**
 * is.fn / is.function (deprecated)
 * Test if `value` is a function.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is a function, false otherwise
 * @api public
 */

is.fn = is['function'] = function (value) {
  var isAlert = typeof window !== 'undefined' && value === window.alert;
  return isAlert || toStr.call(value) === '[object Function]';
};

/**
 * Test number.
 */

/**
 * is.number
 * Test if `value` is a number.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is a number, false otherwise
 * @api public
 */

is.number = function (value) {
  return toStr.call(value) === '[object Number]';
};

/**
 * is.infinite
 * Test if `value` is positive or negative infinity.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is positive or negative Infinity, false otherwise
 * @api public
 */
is.infinite = function (value) {
  return value === Infinity || value === -Infinity;
};

/**
 * is.decimal
 * Test if `value` is a decimal number.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is a decimal number, false otherwise
 * @api public
 */

is.decimal = function (value) {
  return is.number(value) && !isActualNaN(value) && !is.infinite(value) && value % 1 !== 0;
};

/**
 * is.divisibleBy
 * Test if `value` is divisible by `n`.
 *
 * @param {Number} value value to test
 * @param {Number} n dividend
 * @return {Boolean} true if `value` is divisible by `n`, false otherwise
 * @api public
 */

is.divisibleBy = function (value, n) {
  var isDividendInfinite = is.infinite(value);
  var isDivisorInfinite = is.infinite(n);
  var isNonZeroNumber = is.number(value) && !isActualNaN(value) && is.number(n) && !isActualNaN(n) && n !== 0;
  return isDividendInfinite || isDivisorInfinite || (isNonZeroNumber && value % n === 0);
};

/**
 * is.integer
 * Test if `value` is an integer.
 *
 * @param value to test
 * @return {Boolean} true if `value` is an integer, false otherwise
 * @api public
 */

is.integer = is['int'] = function (value) {
  return is.number(value) && !isActualNaN(value) && value % 1 === 0;
};

/**
 * is.maximum
 * Test if `value` is greater than 'others' values.
 *
 * @param {Number} value value to test
 * @param {Array} others values to compare with
 * @return {Boolean} true if `value` is greater than `others` values
 * @api public
 */

is.maximum = function (value, others) {
  if (isActualNaN(value)) {
    throw new TypeError('NaN is not a valid value');
  } else if (!is.arraylike(others)) {
    throw new TypeError('second argument must be array-like');
  }
  var len = others.length;

  while (--len >= 0) {
    if (value < others[len]) {
      return false;
    }
  }

  return true;
};

/**
 * is.minimum
 * Test if `value` is less than `others` values.
 *
 * @param {Number} value value to test
 * @param {Array} others values to compare with
 * @return {Boolean} true if `value` is less than `others` values
 * @api public
 */

is.minimum = function (value, others) {
  if (isActualNaN(value)) {
    throw new TypeError('NaN is not a valid value');
  } else if (!is.arraylike(others)) {
    throw new TypeError('second argument must be array-like');
  }
  var len = others.length;

  while (--len >= 0) {
    if (value > others[len]) {
      return false;
    }
  }

  return true;
};

/**
 * is.nan
 * Test if `value` is not a number.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is not a number, false otherwise
 * @api public
 */

is.nan = function (value) {
  return !is.number(value) || value !== value;
};

/**
 * is.even
 * Test if `value` is an even number.
 *
 * @param {Number} value value to test
 * @return {Boolean} true if `value` is an even number, false otherwise
 * @api public
 */

is.even = function (value) {
  return is.infinite(value) || (is.number(value) && value === value && value % 2 === 0);
};

/**
 * is.odd
 * Test if `value` is an odd number.
 *
 * @param {Number} value value to test
 * @return {Boolean} true if `value` is an odd number, false otherwise
 * @api public
 */

is.odd = function (value) {
  return is.infinite(value) || (is.number(value) && value === value && value % 2 !== 0);
};

/**
 * is.ge
 * Test if `value` is greater than or equal to `other`.
 *
 * @param {Number} value value to test
 * @param {Number} other value to compare with
 * @return {Boolean}
 * @api public
 */

is.ge = function (value, other) {
  if (isActualNaN(value) || isActualNaN(other)) {
    throw new TypeError('NaN is not a valid value');
  }
  return !is.infinite(value) && !is.infinite(other) && value >= other;
};

/**
 * is.gt
 * Test if `value` is greater than `other`.
 *
 * @param {Number} value value to test
 * @param {Number} other value to compare with
 * @return {Boolean}
 * @api public
 */

is.gt = function (value, other) {
  if (isActualNaN(value) || isActualNaN(other)) {
    throw new TypeError('NaN is not a valid value');
  }
  return !is.infinite(value) && !is.infinite(other) && value > other;
};

/**
 * is.le
 * Test if `value` is less than or equal to `other`.
 *
 * @param {Number} value value to test
 * @param {Number} other value to compare with
 * @return {Boolean} if 'value' is less than or equal to 'other'
 * @api public
 */

is.le = function (value, other) {
  if (isActualNaN(value) || isActualNaN(other)) {
    throw new TypeError('NaN is not a valid value');
  }
  return !is.infinite(value) && !is.infinite(other) && value <= other;
};

/**
 * is.lt
 * Test if `value` is less than `other`.
 *
 * @param {Number} value value to test
 * @param {Number} other value to compare with
 * @return {Boolean} if `value` is less than `other`
 * @api public
 */

is.lt = function (value, other) {
  if (isActualNaN(value) || isActualNaN(other)) {
    throw new TypeError('NaN is not a valid value');
  }
  return !is.infinite(value) && !is.infinite(other) && value < other;
};

/**
 * is.within
 * Test if `value` is within `start` and `finish`.
 *
 * @param {Number} value value to test
 * @param {Number} start lower bound
 * @param {Number} finish upper bound
 * @return {Boolean} true if 'value' is is within 'start' and 'finish'
 * @api public
 */
is.within = function (value, start, finish) {
  if (isActualNaN(value) || isActualNaN(start) || isActualNaN(finish)) {
    throw new TypeError('NaN is not a valid value');
  } else if (!is.number(value) || !is.number(start) || !is.number(finish)) {
    throw new TypeError('all arguments must be numbers');
  }
  var isAnyInfinite = is.infinite(value) || is.infinite(start) || is.infinite(finish);
  return isAnyInfinite || (value >= start && value <= finish);
};

/**
 * Test object.
 */

/**
 * is.object
 * Test if `value` is an object.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an object, false otherwise
 * @api public
 */

is.object = function (value) {
  return toStr.call(value) === '[object Object]';
};

/**
 * is.hash
 * Test if `value` is a hash - a plain object literal.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is a hash, false otherwise
 * @api public
 */

is.hash = function (value) {
  return is.object(value) && value.constructor === Object && !value.nodeType && !value.setInterval;
};

/**
 * Test regexp.
 */

/**
 * is.regexp
 * Test if `value` is a regular expression.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is a regexp, false otherwise
 * @api public
 */

is.regexp = function (value) {
  return toStr.call(value) === '[object RegExp]';
};

/**
 * Test string.
 */

/**
 * is.string
 * Test if `value` is a string.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if 'value' is a string, false otherwise
 * @api public
 */

is.string = function (value) {
  return toStr.call(value) === '[object String]';
};

/**
 * Test base64 string.
 */

/**
 * is.base64
 * Test if `value` is a valid base64 encoded string.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if 'value' is a base64 encoded string, false otherwise
 * @api public
 */

is.base64 = function (value) {
  return is.string(value) && (!value.length || base64Regex.test(value));
};

/**
 * Test base64 string.
 */

/**
 * is.hex
 * Test if `value` is a valid hex encoded string.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if 'value' is a hex encoded string, false otherwise
 * @api public
 */

is.hex = function (value) {
  return is.string(value) && (!value.length || hexRegex.test(value));
};

/**
 * is.symbol
 * Test if `value` is an ES6 Symbol
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is a Symbol, false otherise
 * @api public
 */

is.symbol = function (value) {
  return typeof Symbol === 'function' && toStr.call(value) === '[object Symbol]' && typeof symbolValueOf.call(value) === 'symbol';
};

},{}],4:[function(require,module,exports){
var AutoComplete = function (map, marker_url) {
    var searchInput = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(searchInput);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(searchInput);
    this.registerEvent(map, searchBox, marker_url);
};

AutoComplete.prototype.registerEvent = function (map, searchBox, marker_url) {
    var markers = [];
    map.addListener('bounds_changed', function () {
        searchBox.setBounds(map.getBounds());
    });
    searchBox.addListener('places_changed', function () {
        var places = searchBox.getPlaces();
        if (places.length == 0) {
            return;
        }
        markers.forEach(function (marker) {
            marker.setMap(null);
        });
        markers = [];
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {
            markers.push(new google.maps.Marker({
                map: map,
                icon: marker_url,
                title: place.name,
                position: place.geometry.location
            }));
            if (place.geometry.viewport) {
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });
};
module.exports = AutoComplete;

},{}],5:[function(require,module,exports){
var sb = require('./sphericalbounds');
var _extend = require('node.extend');

var BoundsManager = function (options) {
    this.options = _extend({
        padding: {},
        maxZoom: 21,
        mapHeight: 100,
        mapWidth: 100
    }, options);

    this.padding = _extend({top: 20, bottom: 20, left: 20, right: 20}, this.options.padding);
};


BoundsManager.prototype.getCenterWithPadding = function (bounds, zoom) {
    var meterBounds = sb.fromLatLngBounds(bounds);

    var pixelBounds = meterBounds.toPixel(zoom);

    pixelBounds.sw.x -= this.padding.left;
    pixelBounds.ne.x += this.padding.right;
    pixelBounds.sw.y += this.padding.top;
    pixelBounds.ne.y -= this.padding.bottom;

    var newBounds = pixelBounds.toLatLngBounds(zoom);

    return newBounds.getCenter();
};


BoundsManager.prototype.getZoomForBounds = function (bounds) {
    var worldSize = {height: 256, width: 256};
    var mapSize = {
        width: this.options.mapWidth - (this.padding.left + this.padding.right),
        height: this.options.mapHeight - (this.padding.top + this.padding.bottom)
    };

    var ZOOM_MAX = this.options.maxZoom;

    function latRad(lat) {
        var sin = Math.sin(lat * Math.PI / 180);
        var radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
        return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
    }

    function zoom(mapPx, worldPx, fraction) {
        return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2);
    }

    var ne = bounds.getNorthEast();
    var sw = bounds.getSouthWest();

    var latFraction = (latRad(ne.lat()) - latRad(sw.lat())) / Math.PI;

    var lngDiff = ne.lng() - sw.lng();
    var lngFraction = ((lngDiff < 0) ? (lngDiff + 360) : lngDiff) / 360;

    var latZoom = ZOOM_MAX;
    var lngZoom = ZOOM_MAX;

    if (lngFraction > 0) {
        lngZoom = zoom(mapSize.width, worldSize.width, lngFraction);
    }

    if (latFraction > 0) {
        latZoom = zoom(mapSize.height, worldSize.height, latFraction)
    }

    return Math.min(latZoom, lngZoom, ZOOM_MAX);
};

BoundsManager.prototype.getBoundsCenterAndZoom = function (bounds) {
    var zoom = this.getZoomForBounds(bounds);
    var center = this.getCenterWithPadding(bounds, zoom);

    return {
        center: center,
        zoom: zoom
    }
};

module.exports = BoundsManager;
},{"./sphericalbounds":11,"node.extend":1}],6:[function(require,module,exports){
module.exports = {
    getDataSource: function () {
        return {
            "bars": [
                {
                    "name": "Papa Doble",
                    "type": "blue",
                    "address": "6 Rue du Petit Scel",
                    "city": "Montpellier"
                },
                {
                    "name": "O'Carolans Irish Pub",
                    "type": "red",
                    "address": "5 Rue du Petit Scel",
                    "city": "Montpellier"
                },
                {
                    "name": "Sushi-Bar",
                    "type": "blue",
                    "address": "20 Rue Bernard Délicieux",
                    "city": "Montpellier"
                },
                {
                    "name": "Trinque Fougasse",
                    "type": "red",
                    "address": "1581 Route de Mende",
                    "city": "Montpellier"
                },
                {
                    "name": "La Distillerie",
                    "type": "blue",
                    "address": "67 Rue de l'Aiguillerie",
                    "city": "Montpellier"
                },
                {
                    "name": "Times Café",
                    "address": "7 Rue des Teissiers",
                    "city": "Montpellier",
                    "type": "red"
                },
                {
                    "name": "By Coss Bar",
                    "address": "5 Rue Belmont",
                    "city": "Montpellier",
                    "type": "blue"
                }
            ]
        }
    }
};

},{}],7:[function(require,module,exports){
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
                    self.geocode(poi[index], googleGeocoder, map, marker_url);
                    if (index === poi.length - 1) {
                        setTimeout(callback(stores), 1000);
                    }
                }
            })(data, i), delay);
        delay += 1000;
    }
};

Geocoder.prototype.geocode = function (poi, geocoder, map, marker_url) {
    var self = this;
    var address = poi.address + ", " + poi.city;
    geocoder.geocode({'address': address}, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var feature = {
                type: 'Feature',
                properties: results,
                data_properties: poi,
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
            console.log("error_geoccoding_data");
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

},{"./data":6}],8:[function(require,module,exports){
var ListPanel = function (parent) {
    this._container = document.getElementById('list-panel');
    parent.appendChild(this._container);
};

ListPanel.prototype.setVisible = function (visibilty) {
    var display = 'none';
    if (visibilty) {
        display = 'block';
    }
    this._container.style.display = display;
};

ListPanel.prototype.clear = function () {
    this._container.innerHTML = '';
};

ListPanel.prototype.renderStore = function (store) {
    var cell = document.createElement('div');
    var streetView = 'https://maps.googleapis.com/maps/api/streetview?size=250x100&location={latlng}'.replace('{latlng}', store.position);
    cell.innerHTML = '<div class="container"><b>' + store.data_properties.name + '</b>' + '<br/>' +
        '<span>' + store.properties.distancetext + ' : ' + store.properties.duration + '</span>' +
        '<span class="btn">Itineréaire</span>' +
        '<img src="' + streetView + '"/></div>';
    return cell;
};

ListPanel.prototype.render = function (stores) {
    this.clear();
    var header = document.createElement('div');
    header.innerHTML = '<h1 class="container">The 5 closest Bars</h1>';
    this._container.appendChild(header);
    for (var i = 0; i < stores.length; i++) {
        this._container.appendChild(this.renderStore(stores[i]));
    }
};

module.exports = ListPanel;
},{}],9:[function(require,module,exports){
var MapStyle = require('./mapstyle');
var AutoComplete = require('./autocomplete');
var Geocoder = require('./geocoder');
var BoundsManager = require('./boundsmanager');
var ListPanel = require('./listpanel');

window.initMap = function () {
    var latitude = 43.610430,
        longitude = 3.875395,
        map_zoom = 13;
    var pointsOfInterest = [];
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

};


},{"./autocomplete":4,"./boundsmanager":5,"./geocoder":7,"./listpanel":8,"./mapstyle":10}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
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
},{}]},{},[9])