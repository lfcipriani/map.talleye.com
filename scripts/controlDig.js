/* Contants */  
var LATLIMIT = 85;
/* variables */
var marker = null; //Gmarker: green flag, initial point for the line
var endMarker = null; //Gmarker: red flag, end point for the line
var resetPoint = null;
var help = null; //helpControl
var iiwc = null; //ifIWalkControl
var geocoder = null; //Geocoder for searchs

var iniLatitude = null;
var iniLongitude = null;
var endLatitude = null;
var endLongitude = null;
var state = "CONFIG";
var validFloat = new RegExp('^(\-?[0-9]+\.?[0-9]*|\.[0-9]+)$');
var validInt = new RegExp('^([0-9]+)$');
var context = "http://map.talleye.com/";

function digHole()  {

	document.map.closeInfoWindow();

	iniLatitude = marker.getPoint().lat();
	iniLongitude = marker.getPoint().lng();
	
	var endLatitude = -1 * iniLatitude;
	if (iniLongitude < 0) {
		endLongitude = 180 - Math.abs(iniLongitude);
	} else {
		endLongitude = -1 * (180 - iniLongitude);
	}

	endMarker = endFlagDraw(new GLatLng(endLatitude, endLongitude));
	
	changeState("VIEW");
	help.setActiveHelp('holeDig');
	$('exportLinkDiv').style.display = "none";
}

function drawLineServer() {
	var pars = '';
	
	pars += 'lat='+ marker.getPoint().lat() +'&lng='+ marker.getPoint().lng()+'&dir='+ initialBearing +'&rel='+ resolution;
	if (!isCompassSite) {
		pars += '&latend='+ endMarker.getPoint().lat() +'&lngend='+ endMarker.getPoint().lng();
	} else {
		pars += '&latend=NULL&lngend=NULL';
	}

	var drawLineServerJax = new Ajax.Request( 
		"pathPlots.php", 
		{ method: 'get', 
		  parameters: pars });
}

/*-------------------------------- controle do gmaps  -----------------------------------------*/

function centerMap() {
  var addressQuery = $('txtAddress').value;

  if (addressQuery.length > 0) {
	
    geocoder.getLatLng(addressQuery,
	function(pointQuery) {
		
		if (!pointQuery) {
			alert('Place "' + addressQuery + '" not found');
		} else {
			document.map.setCenter(pointQuery, 13);
			if (state == "CONFIG") {
				marker.setPoint(pointQuery);
				compass.hide();
			} else if (state == "VIEW") {
				eyeMarker.setPoint(pointQuery);
			}
		}
	});
  }
}

function createInitialMarker(point) {

  var f = mapIcons.getGreenFlag();

  newMarker = new GMarker(point,
    {icon: f,
     draggable: true,
	 title: "Click to dig a hole."});

  return newMarker;
}

function createEndMarker(point) {

  var f = mapIcons.getRedFlag();

  newMarker = new GMarker(point,
    {icon: f,
     draggable: false,
	 title: "Click to see the info."});

  return newMarker;
}

function _infoHeader(point, distance) {
	result = '';
	result += '<div class="header"><span><img src="img/world.gif" class="align" alt="Coordinates" title="This point\'s coordinates"/>&nbsp;'+LatLong.getHumanLat(point.latRadians())+", "+LatLong.getHumanLong(point.lngRadians())+'&nbsp;&nbsp;&nbsp;&nbsp;';
	if (distance > 0) 
		result += '<img src="img/distance.gif" class="align" alt="Distance" title="Distance from start point"/>&nbsp;'+ (distance / 1000).toFixed(3) +' km';
	result += '</span></div>';
	return result;
}

function newMap() {
	if (!GBrowserIsCompatible()) {
		alert('Your browser is not compatible with the Google Maps API');
		return;
	}

	document.map = new GMap2(document.getElementById("map"));
	document.map.setCenter(new GLatLng(0,0 ), 2);
	document.map.addControl(new GLargeMapControl());
	document.map.addControl(new GMapTypeControl());
	document.map.addControl(new GScaleControl());
	iiwc = new IfIWalkControl();
	document.map.addControl(iiwc);
	help = new HelpControl(parent.i18n.document);
	document.map.addControl(help);
	mapIcons = new MapIcons();
	geocoder = new GClientGeocoder();
	
	help.setActiveHelp('startDig');
}

function isValidCoord(kind, value) {
	if (!validFloat.test(value)) 
		return false;
	else if (kind == "lat") {
		if (value < -90 || value > 90)
			return false;
	} else if (kind == "lng") {
		if (value < -180 || value > 180)
			return false;
	}
	return true;
}

function createWithVars(lat, lng) {
	if (isValidCoord("lat",lat) && isValidCoord("lng",lng)) {
		createMap();
		cwvFlagPoint = new GLatLng(lat, lng);
		flagPointDraw(cwvFlagPoint);
		digHole();
		window.location = "#onLinking";
	} else {
		createMap();
	}
}

// Create the Google Map to be used.
function createMap() {

  newMap();

  GEvent.addListener(document.map, "click", function(overlay, point) {
	
	// CONFIG
	if (state == "CONFIG") {
		if (point) {
		    flagPointDraw(point);
			help.setActiveHelp('digGreenFlag');
		}
	} // VIEW 
	else if (state == "VIEW") {
	
		if (point) {
			
			
		} else if (overlay) {
			
			
		}
		
	}
	
  });
}

function flagPointDraw(point) {

	if (marker == null) {
		marker = createInitialMarker(point);
		marker.enableDragging();

		GEvent.addListener(marker, "dragstart", function() {
			document.map.closeInfoWindow();
		});

		GEvent.addListener(marker, "click", function() {
			if (state == "CONFIG") {
				generateInfoForm();
				help.setActiveHelp('digGreenFlagClicked');
			} 
		});

		GEvent.addListener(marker, "infowindowclose", function () {
			
		});

		document.map.addOverlay(marker);
	} else {
	  marker.setPoint(point);
	}
	
}

function endFlagDraw(point) {
	endMarker = createEndMarker(point);

	GEvent.addListener(endMarker, "click", function() {
		if (state == "VIEW") {
			generateEndInfoForm();
		} 
	});

	GEvent.addListener(endMarker, "infowindowclose", function () {
		
	});

	document.map.addOverlay(endMarker);
	document.map.setCenter(endMarker.getPoint());
	generateEndInfoForm();
	
	return endMarker;
}

function cancelDraw() {
	document.map.closeInfoWindow();
	help.setActiveHelp('digGreenFlag');
}

function generateInfoForm() {
	result = ""

	result += '<div id="infoForm">';
	result += _infoHeader(marker.getPoint(), 0);
	result += '<span>To start dig your hole, click on "Dig here!" button:</span>';	
	result += '<div class="right"><input type="button" class="button" value="Dig here!" name="drawButton" onclick="digHole()" />&nbsp;&nbsp;';
	result += '<input type="button" class="button" value="Cancel" name="cancelButton" onclick="cancelDraw()" />';
	result += '</div>';
	
	marker.openInfoWindowHtml(result);
}

function generateEndInfoForm() {
	result = ""

	result += '<div id="infoForm">';
	result += _infoHeader(endMarker.getPoint(), 0);
	
	result += '<span><b>Your hole ends here!</b><br /><br />';
	result += 'If you think that dig a hole will be hard, <a href="index.php" target="_blank" title="Go to walk!">you could walk...</a><br /><br />';
	result += '</span>';
	result += '</div>';
	
	endMarker.openInfoWindowHtml(result);
	
}

function changeState(type) {
	state = type;
	if (type == "CONFIG") {
		iiwc.setEnabled(false);
		if (marker != null)
			marker.enableDragging();
	} else if (state == "VIEW") {
		iiwc.setEnabled(true);
		marker.disableDragging();
	}
}

function resetMap() {
  var deleteConfirm = confirm("Are you sure you want to start a new hole?");

  if (deleteConfirm) {
	if (marker != null) {
		resetPoint = marker.getPoint();
	}
    document.map.clearOverlays();
	if (resetPoint != null) {
		marker = null;
		flagPointDraw(resetPoint);
	}
	endMarker = null;
	changeState("CONFIG");
	if (marker != null) 
		help.setActiveHelp('digGreenFlag');
	else
		help.setActiveHelp('startDig');
	
  }
}

function webLinkExport() {
	var urlGenerated = context + "bighole.php?lat="+ marker.getPoint().lat() +"&lng="+ marker.getPoint().lng();
	$('exportLinkTest').innerHTML = urlGenerated;
	$('exportLinkDiv').style.display = "block";
	$('exportLinkTest').href = urlGenerated;
	
	window.location = "#exportLinkAnchor";
}

/*
  This code below is licensed under Creative Commons GNU GPL License
  http://creativecommons.org/licenses/GPL/2.0/
  Copyright (C) 2006 Russel Lindsay
  www.weetbixthecat.com
*/
Array.prototype.binarySearch = function(item)
{
  var left = -1, 
      right = this.length, 
      mid;
  
  while(right - left > 1)
  {
    mid = (left + right) >>> 1;
    if(this[mid] < item)
      left = mid;
    else
      right = mid;
  }
  
  if(this[right] != item)
    return -(right + 1);
  
  return right;
}