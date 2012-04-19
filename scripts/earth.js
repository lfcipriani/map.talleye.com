/*
 * LatLong object - methods summary
 *
 *   p = new LatLong('512839N', '0002741W')
 *   p = new LatLong(53.123, -1.987)
 *
 *   dist = LatLong.distHaversine(p1, p2)
 *   dist = LatLong.distCosineLaw(p1, p2)
 *   dist = LatLong.distVincenty(p1, p2)
 *
 *   brng = LatLong.bearing(p1, p2)
 *   dist = p1.distAlongVector(orig, dirn)
 *   p = LatLong.midPoint(p1, p2)
 *   p2 = p1.destPoint(initBrng, dist)
 *   brng = p.finalBrng(initBrng, dist)
 *
 *   dist = LatLong.distRhumb(p1, p2)
 *   brng = LatLong.brngRhumb(p1, p2)
 *   p2 = p1.destPointRhumb(brng, dist)
 *
 *   rad = LatLong.llToRad('51º28'39"N')
 *   latDms = p.latitude()
 *   lonDms = p.longitude()
 *   dms = LatLong.radToDegMinSec(0.1284563)
 *   dms = LatLong.radToBrng(0.1284563)
 *
 * properties:
 *   p.lat - latitude in radians (0=equator, pi/2=N.pole)
 *   p.lon - longitude in radians (0=Greenwich, E=+ve)
 *
 * © 2002-2005 Chris Veness, www.movable-type.co.uk
 */


/*
 * LatLong constructor:
 *
 *   arguments are in degrees: signed decimal or d-m-s + NSEW as per LatLong.llToRad()
 * (SEMPRE PASSE STRINGS COMO PARAMETRO)
 */
function LatLong(degLat, degLong) {
  this.lat = LatLong.llToRad(degLat);
  this.lon = LatLong.llToRad(degLong);
}


/*
 * calculate (initial) bearing (in radians clockwise) between two points
 *
 * from: Ed Williams' Aviation Formulary, http://williams.best.vwh.net/avform.htm#Crs
 */
LatLong.bearing = function(p1, p2) {
  var y = Math.sin(p2.lon-p1.lon) * Math.cos(p2.lat);
  var x = Math.cos(p1.lat)*Math.sin(p2.lat) -
          Math.sin(p1.lat)*Math.cos(p2.lat)*Math.cos(p2.lon-p1.lon);
  return Math.atan2(y, x);
}


/*
 * calculate midpoint of great circle line between p1 & p2.
 *   see http://mathforum.org/library/drmath/view/51822.html for derivation
 */
LatLong.midPoint = function(p1, p2) {
  var dLon = p2.lon - p1.lon;

  var Bx = Math.cos(p2.lat) * Math.cos(dLon);
  var By = Math.cos(p2.lat) * Math.sin(dLon);

  lat3 = Math.atan2(Math.sin(p1.lat)+Math.sin(p2.lat),
                    Math.sqrt((Math.cos(p1.lat)+Bx)*(Math.cos(p1.lat)+Bx) + By*By ) );
  lon3 = p1.lon + Math.atan2(By, Math.cos(p1.lat) + Bx);

  if (isNaN(lat3) || isNaN(lon3)) return null;
  return new LatLong(lat3*180/Math.PI, lon3*180/Math.PI);
}


/*
 * calculate destination point given start point, initial bearing and distance
 *   see http://williams.best.vwh.net/avform.htm#LL
 */
LatLong.prototype.destPoint = function(brng, dist) {
  var R = 6371; // earth's mean radius in km
  var p1 = this, p2 = new LatLong(0,0), d = parseFloat(dist)/R;  // d = angular distance covered on earth's surface
  brng = LatLong.degToRadBearing(brng); //ALTERACAO

  p2.lat = Math.asin( Math.sin(p1.lat)*Math.cos(d) + Math.cos(p1.lat)*Math.sin(d)*Math.cos(brng) );
  p2.lon = p1.lon + Math.atan2(Math.sin(brng)*Math.sin(d)*Math.cos(p1.lat), Math.cos(d)-Math.sin(p1.lat)*Math.sin(p2.lat));

  if (isNaN(p2.lat) || isNaN(p2.lon)) return null;
  return p2;
}


/*
 * calculate final bearing arriving at destination point given start point, initial bearing and distance
 */
LatLong.prototype.finalBrng = function(brng, dist) {
  var p1 = this, p2 = p1.destPoint(brng, dist);
  // get reverse bearing point 2 to point 1 & reverse it by adding 180º
  var h2 = (LatLong.bearing(p2, p1) + Math.PI) % (2*Math.PI);
  return h2;
}


/*
 * convert lat/long in degrees to radians, for handling input values
 *
 *   this is very flexible on formats, allowing signed decimal degrees (numeric or text), or
 *   deg-min-sec suffixed by compass direction (NSEW). A variety of separators are accepted
 *   (eg 3º 37' 09"W) or fixed-width format without separators (eg 0033709W). Seconds and minutes
 *   may be omitted. Minimal validation is done.
 */
LatLong.llToRad = function(llDeg) {
  if (!isNaN(llDeg)) return llDeg * Math.PI / 180;  // signed decimal degrees without NSEW

  llDeg = llDeg.replace(/[\s]*$/,'');               // strip trailing whitespace
  var dir = llDeg.slice(-1).toUpperCase();          // compass dir'n
  if (!/[NSEW]/.test(dir)) return NaN;              // check for correct compass direction
  llDeg = llDeg.slice(0,-1);                        // and lose it off the end
  var dms = llDeg.split(/[\s:,°º′\'″\"]/);          // check for separators indicating d/m/s
  if (dms[dms.length-1] == '') dms.length--;        // trailing separator? (see note below)
  switch (dms.length) {                             // convert to decimal degrees...
    case 3:                                         // interpret 3-part result as d/m/s
      var deg = dms[0]/1 + dms[1]/60 + dms[2]/3600; break;
    case 2:                                         // interpret 2-part result as d/m
      var deg = dms[0]/1 + dms[1]/60; break;
    case 1:                                         // non-separated format dddmmss
      if (/[NS]/.test(dir)) llDeg = '0' + llDeg;    // - normalise N/S to 3-digit degrees
      var deg = llDeg.slice(0,3)/1 + llDeg.slice(3,5)/60 + llDeg.slice(5)/3600; break;
    default: return NaN;
  }
  if (/[WS]/.test(dir)) deg = -deg;                 // take west and south as -ve
  return deg * Math.PI / 180;                       // then convert to radians
}
// note: 'x-'.split(/-/) should give ['x',''] but in IE just gives ['x']


/*
 * convert degrees to radians - used for bearing, so 360º with no N/S/E/W suffix
 *   can accept d/m/s, d/m, or decimal degrees
 * THE PARAMETER IS STRING
 */
LatLong.degToRad = function(brng) {
  var dms = brng.split(/[\s:,º°\'\"′″]/)          // check for separators indicating d/m/s
  switch (dms.length) {                           // convert to decimal degrees...
    case 3:                                       // interpret 3-part result as d/m/s
      var deg = dms[0]/1 + dms[1]/60 + dms[2]/3600; break;
    case 2:                                       // interpret 2-part result as d/m
      var deg = dms[0]/1 + dms[1]/60; break;
    default:
      var deg = parseFloat(brng); break;          // otherwise decimal degrees
  }
  return deg * Math.PI / 180;                     // then convert to radians
}

/*
 * convert latitude into degrees, minutes, seconds; eg 51º28'38"N
 */
LatLong.prototype.latitude = function() {
  return LatLong._dms(this.lat).slice(1) + (this.lat<0 ? 'S' : 'N');
}


/*
 * convert longitude into degrees, minutes, seconds; eg 000º27'41"W
 */
LatLong.prototype.longitude = function() {
  return LatLong._dms(this.lon) + (this.lon>0 ? 'E' : 'W');
}


/*
 * convert radians to (signed) degrees, minutes, seconds; eg -0.1rad = -000°05'44"
 */
LatLong.radToDegMinSec = function(rad) {
  return (rad<0?'-':'') + LatLong._dms(rad);
}


/*
 * convert radians to compass bearing - 0°-360° rather than +ve/-ve
 */
LatLong.radToBrng = function(rad) {
  return LatLong.radToDegMinSec((rad+2*Math.PI) % (2*Math.PI));
}

/*
 * convert radians to decimals CRIADO POR MIM!!!
 */
LatLong.radToDec = function(rad) {
  return (rad*180/Math.PI);
}


/*
 * convert radians to deg/min/sec, with no sign or compass dirn (internal use)
 */
LatLong._dms = function(rad) {
  var d = Math.abs(rad * 180 / Math.PI);
  d += 1/7200;  // add ½ second for rounding
  var deg = Math.floor(d);
  var min = Math.floor((d-deg)*60);
  var sec = Math.floor((d-deg-min/60)*3600);
  // add leading zeros if required
  if (deg<100) deg = '0' + deg; if (deg<10) deg = '0' + deg;
  if (min<10) min = '0' + min;
  if (sec<10) sec = '0' + sec;
  return deg + '\u00B0' + min + '\u2032' + sec + '\u2033';
}


/*
 * override toPrecision method with one which displays trailing zeros in place
 *   of exponential notation
 *
 * (for Haversine, use 4 sf to reflect reasonable indication of accuracy)
 */
Number.prototype.toPrecision = function(fig) {
  var scale = Math.ceil(Math.log(this)*Math.LOG10E);
  var mult = Math.pow(10, fig-scale);
  return Math.round(this*mult)/mult;
}


/*
 * it's good form to include a toString method...
 */
LatLong.prototype.toString = function() {
  return this.latitude() + ', ' + this.longitude();
}


//------------------------------------------------------ CRIADO POR MIM

/*
 * convert degrees to radians - used for bearing, so 360º with no N/S/E/W suffix
 *   can accept decimal degrees 
 * THE PARAMETER IS FLOAT
 * CRIADO POR MIM!!!
 */
LatLong.degToRadBearing = function(brng) {
  return brng * Math.PI / 180;                     // then convert to radians
}
/*
 * get point latitude in decimals CRIADO POR MIM!!!
 */
LatLong.prototype.getLat = function() {
  return (this.lat*180/Math.PI);
}
/*
 * get point longitude in decimals CRIADO POR MIM!!!
 */
LatLong.prototype.getLong = function() {
  return (this.lon*180/Math.PI);
}
/*
 * set lat (decimal to lat) CRIADO POR MIM!!!
 */
LatLong.prototype.setLat = function(decLat) {
	this.lat = decLat*Math.PI/180;
}
/*
 * set long (decimal to long) CRIADO POR MIM!!!
 */
LatLong.prototype.setLong = function(decLong) {
  this.lon = decLong*Math.PI/180;
}
/*
 * get point latitude in human readable format CRIADO POR MIM!!!
 */
LatLong.getHumanLat = function(ptLat) {
  return LatLong._dms(ptLat).slice(1) + (ptLat<0 ? 'S' : 'N');
}
/*
 * get point longitude in human readable format CRIADO POR MIM!!!
 */
LatLong.getHumanLong = function(ptLong) {
  return LatLong._dms(ptLong) + (ptLong>0 ? 'E' : 'W');
}
/*
 * calculate (initial) bearing (in radians clockwise) between two points CRIADO POR MIM!!!
 *
 * from: Ed Williams' Aviation Formulary, http://williams.best.vwh.net/avform.htm#Crs
 */
LatLong.bearing2 = function(p1Lat, p1Lon, p2Lat, p2Lon) {
  var y = Math.sin(p2Lon-p1Lon) * Math.cos(p2Lat);
  var x = Math.cos(p1Lat)*Math.sin(p2Lat) -
          Math.sin(p1Lat)*Math.cos(p2Lat)*Math.cos(p2Lon-p1Lon);
  return Math.atan2(y, x);
}
