
/* Contants */  
var LATLIMIT = 85;
var LINEWEIGHT = 10;
var MAX_NEAR_POINTS = 100;
/* variables */
var marker = null; //Gmarker: green flag, initial point for the line
var endMarker = null; //Gmarker: red flag, end point for the line
var eyeMarker = null; //Gmarker: eye, temporary marker of nearpoints
var points = []; //GLatLng[]: points of the line
var resetPoint = null; //used in reset action
var lineMarkers = []; //Gmarker[]: markers of the line
//var eyeMarkers = []; //GMarker[]: eye markers  of nearpoints
var compass = null; //Compass
var npl = null; //nearPointList
var help = null; //helpControl
var iiwc = null; //ifIWalkControl
var bearingSlider = null; //Slider
var geocoder = null; //Geocoder for searchs
var isGreenTime = true;
var isCompassSite;

var state = "CONFIG";
var initialPoint = null; //LatLong
var currentPoint = null;
var initialBearing = 30;
var currentBearing = null;
var initialDirection = null;
var endMarkerDistance = 0;
var resolution = 1000;
var validFloat = new RegExp('^(\-?[0-9]+\.?[0-9]*|\.[0-9]+)$');
var validInt = new RegExp('^([0-9]+)$');
var context = "http://map.talleye.com/";

function drawLine() {
	
	drawLineServer();
	
	points = [];
	var turnAround = false;
	var dayLinePassed = false; 
	var distanceFromOrigin = 0;
	initialPoint = currentPoint = new LatLong(marker.getPoint().lat(), marker.getPoint().lng());
	currentBearing = initialBearing;
	initialDirection = getDirection(initialBearing);		
		
	while (!turnAround) { 
		
		// reach day line?
		if (currentPoint.getLong() > 180) {
			currentPoint.setLong(currentPoint.getLong() - 360);
			dayLinePassed = true;
		} else if (currentPoint.getLong() < -180) {
			currentPoint.setLong(currentPoint.getLong() + 360);
			dayLinePassed = true;
		}
		
		// reach high latitude?
		if (currentPoint.getLat() > LATLIMIT)
			currentPoint.setLat(LATLIMIT);
		if (currentPoint.getLat() < -LATLIMIT)
			currentPoint.setLat(-LATLIMIT);
		
		// checking turn around
		if (dayLinePassed) {
			switch (initialDirection) {
				case "EAST":
					if (currentPoint.getLong() > initialPoint.getLong()) { 
						currentPoint = initialPoint;
						turnAround = true;
					}
					break;
				case "WEST": 
					if (currentPoint.getLong() < initialPoint.getLong()) {
						currentPoint = initialPoint;
						turnAround = true;
					}
					break;
				case "NORTH": 
					if (currentPoint.getLat() > initialPoint.getLat()) {
						currentPoint = initialPoint;
						turnAround = true;
					}
					break;
				case "SOUTH": 
					if (currentPoint.getLat() < initialPoint.getLat()) { 
						currentPoint = initialPoint;
						turnAround = true;
					}
					break;
				default:		
			}
		}
		
		if (!isCompassSite && distanceFromOrigin > endMarkerDistance) {
			points.push(new GLatLng(endMarker.getPoint().lat(), endMarker.getPoint().lng()));
			endMarkerDistance = 100000;
		} 
		points.push(new GLatLng(currentPoint.getLat(), currentPoint.getLong()));
		//DESATIVADO POR MOTIVO DE DESEMPENHO createLineMarker(currentPoint, distanceFromOrigin, currentBearing);
	
		if (!turnAround) {	
			temp = currentPoint.destPoint(currentBearing, resolution);
			distanceFromOrigin += parseInt(resolution);
			currentBearing = LatLong.radToDec(currentPoint.finalBrng(currentBearing, resolution));
			currentPoint = temp;
		}
	}
	var polyline = new GPolyline(points, "#8419D3", LINEWEIGHT);
	document.map.addOverlay(polyline);
	document.map.closeInfoWindow();
	changeState("VIEW");
	help.setActiveHelp('drawLine');
	parent.iNear.window.location = "npPathDrawn.php";
	$('exportLinkDiv').style.display = "none";
}

function drawLine2() {
	
	initialBearing = (LatLong.bearing2(marker.getPoint().latRadians(),marker.getPoint().lngRadians(),endMarker.getPoint().latRadians(),endMarker.getPoint().lngRadians()) * 180 / Math.PI);
	if (initialBearing < 0)
		initialBearing += 360;
	endMarkerDistance = marker.getPoint().distanceFrom(endMarker.getPoint()) / 1000;
	if ($('optRes01').checked)
		resolution = $F('optRes01');
	else if ($('optRes02').checked)
		resolution = $F('optRes02');
	else if ($('optRes03').checked)
		resolution = $F('optRes03');		
	drawLine();
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

function getMidLat(initPoint) {
	var x;
	
	if (initPoint.getLong < 0) {
		x = Math.abs(initPoint.getLong);
		x = 180 - x;
	} else {
		x = initPoint.getLong;
		x = 180 - x;
		x = -1 * x;
	}
	
	return x;
}

function getDirection(bearing) {
	if (bearing > 0 && bearing < 180) 
		return "EAST";
	else if (bearing > 180 && bearing < 360)
		return "WEST";
	else if (bearing == 0)
		return "NORTH";
	else if (bearing == 180)
		return "SOUTH";
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
	 title: "Click to walk or drag to set new point."});

  return newMarker;
}

function createEndMarker(point) {

  var f = mapIcons.getRedFlag();

  newMarker = new GMarker(point,
    {icon: f,
     draggable: true,
	 title: "Click to walk or drag to set new point."});

  return newMarker;
}

function createLineMarker(ePoint, distance, brng) {
// not used

	gpoint = new GLatLng(ePoint.getLat(), ePoint.getLong());

	var f = mapIcons.getPurpleBullet();

	temp = new GMarker(gpoint,
		{icon: f,
		 /*clickable: false,*/
		 title: distance + " km from start point. Direction: "+ LatLong.radToBrng(brng*Math.PI/180) });
		
	lineMarkers.push(temp);
	document.map.addOverlay(temp);
}

function createEyeMarker(eyepoint) {

	var f = mapIcons.getEye();

	newMarker = new GMarker(eyepoint,
		{icon: f,
		 draggable: true,
		 title: "Click to select range."});

	//eyeMarkers.push(newMarker);
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
	document.map.setCenter(new GLatLng(0,0 ), 3);
	document.map.addControl(new GLargeMapControl());
	document.map.addControl(new GMapTypeControl());
	document.map.addControl(new GScaleControl());
	iiwc = new IfIWalkControl();
	document.map.addControl(iiwc);
	help = new HelpControl(parent.i18n.document);
	document.map.addControl(help);
	compass = new Compass();
	npl = new NearPointList(document.map);
	mapIcons = new MapIcons();
	geocoder = new GClientGeocoder();
	
	help.setActiveHelp('start');
}

function createWithVars(knd, lat, lng, dir, rel) {
	if (isValidCoord("lat",lat) && isValidCoord("lng",lng) && isValidDirection(dir)) {
		if (knd == 1) {
			createMap();
			cwvFlagPoint = new GLatLng(lat, lng);
			flagPointDraw(cwvFlagPoint);
			resolution = rel; 
			initialBearing = dir;
			drawLine();
			window.location = "#onLinking";
		} else if (knd == 2){
			createMap2();
			isCompassSite = true;
			cwvFlagPoint = new GLatLng(lat, lng);
			oneFlagDraw(cwvFlagPoint);
			isGreenTime = false;
			resolution = rel; 
			initialBearing = dir;
			drawLine();
			isCompassSite = false;
			window.location = "#onLinking";
		} else  {
			createMap();
		}
	} else {
		createMap();
	}
}

// Create the Google Map to be used.
function createMap() {

  newMap();
  
  isCompassSite = true;

  GEvent.addListener(document.map, "click", function(overlay, point) {
  
	// CONFIG
	if (state == "CONFIG") {
		if (point) {
		    flagPointDraw(point);
			help.setActiveHelp('greenflagCYD');
		}
	} // VIEW 
	else if (state == "VIEW") {
	
		if (point) {
			
			eyePointDraw(point);
			help.setActiveHelp('drawLineEyed');
			
		} else if (overlay) {
			
			if (overlay instanceof GMarker) 
				if (overlay.getIcon().image.indexOf("purple") >= 0)
					eyePointDraw(overlay.getPoint());
			
		}
		
	}
	
  });
}

function createMap2() {

  newMap();
  
  isCompassSite = false;

  GEvent.addListener(document.map, "click", function(overlay, point) {
  
	// CONFIG
	if (state == "CONFIG") {
		if (point) {
			if (isGreenTime) {
				oneFlagDraw(point);
				if (endMarker == null)
					help.setActiveHelp('greenflagCWP');
				else 
					help.setActiveHelp('redflagCWP');
				isGreenTime = false;
			} else {
				oneFlagDraw(point);
				help.setActiveHelp('redflagCWP');
				isGreenTime = true;
			}
		    
		}
	} // VIEW 
	else if (state == "VIEW") {
	
		if (point) {
			
			eyePointDraw(point);
			help.setActiveHelp('drawLineEyed');
			
		} else if (overlay) {
			
			if (overlay instanceof GMarker) 
				if (overlay.getIcon().image.indexOf("purple") >= 0)
					eyePointDraw(overlay.getPoint());
			
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
			compass.hide();
		});

		GEvent.addListener(marker, "click", function() {
			if (state == "CONFIG") {
				generateInfoForm();
				compass.draw(marker.getPoint(), compass.getValue());
				help.setActiveHelp('greenFlagClickedCYD');
			} 
		});

		GEvent.addListener(marker, "infowindowclose", function () {
			bearingSlider = null;
			compass.hide();
		});

		document.map.addOverlay(marker);
	} else {
	  marker.setPoint(point);
	}
	
}

function oneFlagDraw(point) {

	if (isGreenTime) {
		if (marker == null) {
			marker = createInitialMarker(point);
			marker.enableDragging();

			GEvent.addListener(marker, "dragstart", function() {
				document.map.closeInfoWindow();
				//compass.hide();
			});

			GEvent.addListener(marker, "click", function() {
				if (state == "CONFIG") {
					generateStartEndForm(marker);
					if (endMarker != null)
						help.setActiveHelp('flagClickedCWP');
				} 
			});

			GEvent.addListener(marker, "infowindowclose", function () {
				//bearingSlider = null;
				//compass.hide();
			});

			document.map.addOverlay(marker);
		} else {
		  marker.setPoint(point);
		}
	} else {
		if (endMarker == null) {
			endMarker = createEndMarker(point);
			endMarker.enableDragging();

			GEvent.addListener(endMarker, "dragstart", function() {
				document.map.closeInfoWindow();
				//compass.hide();
			});

			GEvent.addListener(endMarker, "click", function() {
				if (state == "CONFIG") {
					generateStartEndForm(endMarker);
					help.setActiveHelp('flagClickedCWP');
				} 
			});

			GEvent.addListener(endMarker, "infowindowclose", function () {
				//bearingSlider = null;
				//compass.hide();
			});

			document.map.addOverlay(endMarker);
		} else {
		  endMarker.setPoint(point);
		}
	}
	
}

function eyePointDraw(point) {

	if (eyeMarker == null) {
		eyeMarker = createEyeMarker(point);
		eyeMarker.enableDragging();
		
		GEvent.addListener(eyeMarker, "dragstart", function() {
			document.map.closeInfoWindow();
			//compass.hide();
		});

		GEvent.addListener(eyeMarker, "click", function() {
			if (state == "VIEW") {
				generateInfoView();
				help.setActiveHelp('drawLineEyedClicked');
			} 
		});
		
		document.map.addOverlay(eyeMarker);
	} else {
		eyeMarker.setPoint(point);
	}
	
}

function cancelDraw() {
	document.map.closeInfoWindow();
	if (isCompassSite) 
		help.setActiveHelp('greenflagCYD');
	else
		help.setActiveHelp('redflagCWP');
	compass.hide();
}

function generateInfoForm() {
	result = ""

	result += '<div id="infoForm">';
	result += _infoHeader(marker.getPoint(), 0);
	result += '<span>Slide the aim to set direction, then go "Walk!":</span>';
	result += '<fieldset>';
	result += '<legend>Direction</legend>';
	result += '<div id="track">';
    result += '<div id="handle"></div></div>';
	result += '<span>Edit this field for more precision: </span><input type="text" id="degreeInput" value="30" name="degreeInputName" onchange="updateSliderValue()" /><span> degrees (eg. 10.034)</span>';
	result += '</fieldset>';
	result += '<fieldset>';
	result += '<legend>Resolution (quality)</legend>';
	result += '<div class="left"><label for="optRes01"><span><input id="optRes01" type="radio" name="optResolution" value="1000" checked="checked" style="vertical-align: -3px;"/>good (faster)</span></label></div>';
	result += '<div class="left"><label for="optRes02"><span><input id="optRes02" type="radio" name="optResolution" value="500" style="vertical-align: -3px;"/>better </span></label></div>';
	result += '<div class="left"><label for="optRes03"><span><input id="optRes03" type="radio" name="optResolution" value="250" style="vertical-align: -3px;"/>perfect (slower)</span></label></div>';
	result += '</fieldset>';
	result += '<div class="right"><input type="button" class="button" value="Walk!" name="drawButton" onclick="preDrawLine()" />&nbsp;&nbsp;';
	result += '<input type="button" class="button" value="Cancel" name="cancelButton" onclick="cancelDraw()" />';
	result += '</div>';
	
	marker.openInfoWindowHtml(result);
	
	bearingSlider = new Control.Slider('handle','track', {axis:'horizontal', range:$R(0,360), minimum: 0, maximum:380, increment: 1,  
	      onSlide: onSliderSlide,
	      onChange: onSliderChange });
	bearingSlider.setValue(initialBearing);
}

function onSliderSlide(value) {
	$('degreeInput').value=value;
}

function onSliderChange(value) {
	$('degreeInput').value=value;
	updateCompass(value);
	initialBearing = value;
}

function updateSliderValue() {
	if (!isValidDirection($F('degreeInput'))) {
		$('degreeInput').value = initialBearing;
		alert('Invalid direction (must to be a valid number).');
		$('degreeInput').focus();
	} else
		bearingSlider.setValue($F('degreeInput'));
}

function isValidDirection(value) {
	if (!validFloat.test(value)) 
		return false;
	else if (value < 0 || value > 360)
		return false;
	return true;
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

function preDrawLine() {
	if ($('optRes01').checked)
		resolution = $F('optRes01');
	else if ($('optRes02').checked)
		resolution = $F('optRes02');
	else if ($('optRes03').checked)
		resolution = $F('optRes03');		
	drawLine();
}

function updateCompass(value) {

	value = Math.round(value);
	
	index = compassImgValues.binarySearch(value);

	if (index < 0)
		index = Math.abs(index)-1;
	
	compassNewValue = compassImgValues[index].toString();
	if (parseInt(compassNewValue) < 10)
		compassNewValue = "00" + compassNewValue;
	else if (parseInt(compassNewValue) < 100)
		compassNewValue = "0" + compassNewValue;	
			
	compass.setValue(compassNewValue);
}

function generateStartEndForm(mk) {
	result = ""

	result += '<div id="infoForm">';
	result += _infoHeader(mk.getPoint(), 0);
	
	if (endMarker == null) {
	
		result += '<span>You don\'t set the point that you will pass yet. Click on map again to do it.</span>';
		
	} else {
	
		result += '<span>You have a start and end point, so go "Walk!":</span>';
		result += '<fieldset>';
		result += '<legend>Direction</legend>';
		result += '<span><img src="img/flag_green.gif" class="align" title="Start point"/>&nbsp;<b>'+LatLong.getHumanLat(marker.getPoint().latRadians())+", "+LatLong.getHumanLong(marker.getPoint().lngRadians())+'</b>'; 
		result += '&nbsp;&nbsp;&nbsp;<img src="img/compassIcon.gif" class="align" title="Direction"/>&nbsp;<b>'+ LatLong.radToBrng(LatLong.bearing2(marker.getPoint().latRadians(),marker.getPoint().lngRadians(),endMarker.getPoint().latRadians(),endMarker.getPoint().lngRadians())) +'</b>';
		result += '<br /><img src="img/flag_red.gif" class="align" title="End point"/>&nbsp;<b>'+LatLong.getHumanLat(endMarker.getPoint().latRadians())+", "+LatLong.getHumanLong(endMarker.getPoint().lngRadians())+'</b> </span>';
		result += '</fieldset>';
		result += '<fieldset>';
		result += '<legend>Resolution (quality)</legend>';
		result += '<div class="left"><label for="optRes01"><span><input id="optRes01" type="radio" name="optResolution" value="1000" checked="checked" style="vertical-align: -3px;"/>good (faster)</span></label></div>';
		result += '<div class="left"><label for="optRes02"><span><input id="optRes02" type="radio" name="optResolution" value="500" style="vertical-align: -3px;"/>better </span></label></div>';
		result += '<div class="left"><label for="optRes03"><span><input id="optRes03" type="radio" name="optResolution" value="250" style="vertical-align: -3px;"/>perfect (slower)</span></label></div>';
		result += '</fieldset>';
		result += '<div class="right"><input type="button" class="button" value="Walk!" name="drawButton" onclick="drawLine2()" />&nbsp;&nbsp;';
		result += '<input type="button" class="button" value="Cancel" name="cancelButton" onclick="cancelDraw()" />';
		

	}
	
	result += '</div>';
	
	mk.openInfoWindowHtml(result);
	
}

function cancelNearPoint() {
	document.map.closeInfoWindow();
	help.setActiveHelp('drawLineEyed');
}

function generateInfoView() {
	result = ""

	result += '<div id="infoForm">';
	result += _infoHeader(eyeMarker.getPoint(), eyeMarker.getPoint().distanceFrom(marker.getPoint()));
	result += '<span><b>View what is near by</b><br />(Powered by <a href="http://geourl.org/" title="GeoURL" ><img src="img/geourl.png" title="GeoURL" border="0" alt="GeoURL"/></a>). <br />Soon you will have more webservices (wikipedia, flickr) to choose.</span>';
	result += '<fieldset>';
	result += '<legend>Select the range of view</legend>';
	result += '<span>Range: </span><select id="range" name="rangeName" />';
	result += '<option value="1">1</option>';
	result += '<option value="5">5</option>';
	result += '<option value="10" selected="selected">10</option>';
	result += '<option value="25">25</option>';
	result += '<option value="50">50</option>';
	result += '<option value="100">100</option>';
	result += '<option value="500">500</option>';
	result += '</select><span> km</span>';
	result += '</fieldset>';
	result += '<div class="right"><input type="button" class="button" value="View!" name="findButton" onclick="findNearPoints()" />&nbsp;&nbsp;';
	result += '<input type="button" class="button" value="Cancel" name="cancelButton" onclick="cancelNearPoint()" />';
	result += '</div></div>';
	
	eyeMarker.openInfoWindowHtml(result);
}

// not used
function checkRangeValue() {
	if (!validInt.test($F('range'))) {
		alert('Invalid range. The number must be an integer.');
		return false;
	} else if ($F('range') <= 0 || $F('range') > 1000) {
		alert('Invalid range. The number must be between 1 and 1000.');
		return false;
	}	
	return true;
}

function findNearPoints() {

	if (!checkRangeValue()) {
		return false;
	}

	geoLat = eyeMarker.getPoint().lat();
	geoLng = eyeMarker.getPoint().lng();
	geoRaio = $F('range'); //ver o valor disso aqui
	
	var url = 'rssreader.php';
	var pars = 'lat='+geoLat+'&lng='+geoLng+'&raio='+geoRaio;
	
	parent.iNear.window.location = url + '?' + pars;
	
	// carregar isso no Iframe (não haverá mais chamada ajax aqui
	/*var nearResponse = new Ajax.Request( 
		url, 
		{ method: 'get', 
		  parameters: pars,
		  /*onCreate: cbLoading,*/
		  /*onSuccess: cbParseNearPoints }); */
		
	document.map.closeInfoWindow();
	
	help.setActiveHelp('nearPoints');
}

function cbParseNearPoints() {

	var tagPre = parent.iNear.document.getElementsByTagName('pre');
	
	if (tagPre.length != 0)
		populateNearPoints(tagPre);	
	
}

function populateNearPoints(pre) {

	npl.setCenter(eyeMarker.getPoint());

	//loop para passar em todos os pontos
	for (i = 0;i < pre.length; i++) {
		
		var preDivs = pre[i].childNodes;
		j = 0;
	
		// point
		while (preDivs[j].className != 'geo') j++;
		var geoAbbrs = preDivs[j].childNodes;
		for (z = 0;z < geoAbbrs.length; z++) {
			if (geoAbbrs[z].className == 'latitude')
				var npLatitude = geoAbbrs[z].getAttribute('title');
			else if (geoAbbrs[z].className == 'longitude')
				var npLongitude = geoAbbrs[z].getAttribute('title');
		}
		
		// link
		while (preDivs[j].className != 'link') j++;
		var npLink = preDivs[j].firstChild.nodeValue;
		j++;
		
		// title
		while (preDivs[j].className != 'title') j++;
		var npTitle = preDivs[j].firstChild.nodeValue;
		j++;
		
		//description
		while (preDivs[j].className != 'description') j++;
		var npDescription = preDivs[j].firstChild.nodeValue;
		j++;
		
		//nearPlace
		while (preDivs[j].className != 'nearPlace') j++;
		var npNearPlace = preDivs[j].firstChild.nodeValue;
		j++;
		
		//distanceFromEye
		while (preDivs[j].className != 'distanceFromEye') j++;
		var npDFE = preDivs[j].firstChild.nodeValue;
		
	
		//instancia o nearpoint
		npPoint = new GLatLng(npLatitude, npLongitude);
		
		npl.add(new NearPoint(npPoint, npTitle, npLink, npDescription, npDFE, npNearPlace));
	}

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
		if (!isCompassSite) {
			endMarker.disableDragging();
		}
	}
}

function resetMap() {
  var deleteConfirm = confirm("Are you sure you want to start a new path?");

  if (deleteConfirm) {
	if (marker != null) {
		resetPoint = marker.getPoint();
	}
    parent.iNear.window.location = "npIndex.php";
	npl.clearAll();
    document.map.clearOverlays();
	eyeMarker = null;
    points = [];
	lineMarkers = [];
	isGreenTime = true;
	if (resetPoint != null) {
		marker = null;
		if (isCompassSite) 
			flagPointDraw(resetPoint);
		else 
			oneFlagDraw(resetPoint);
		isGreenTime = false;
	}
	endMarker = null;
	changeState("CONFIG");
	if (isCompassSite) {
		if (marker != null) 
			help.setActiveHelp('greenflagCYD');
		else
			help.setActiveHelp('start');
	} else {
		if (marker != null) 
			help.setActiveHelp('greenflagCWP');
		else
			help.setActiveHelp('start');
	}
  }
}

function googleEarthExport() {
	window.location = "kmlgen.php?lat="+marker.getPoint().lat()+"&lng="+marker.getPoint().lng()+"&hdn="+initialBearing;
}

function webLinkExport() {
	var knd = (isCompassSite?"cyd":"cwp");
	var urlGenerated = context + "index.php?knd="+ knd +"&lat="+ marker.getPoint().lat() +"&lng="+ marker.getPoint().lng() +"&dir="+ initialBearing +"&rel="+ resolution ;
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