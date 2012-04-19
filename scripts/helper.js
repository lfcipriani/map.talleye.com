// MAP ICONS
function MapIcons() {
	this._greenFlag = null;
	this._yellowFlag = null;
	this._redFlag = null;
	this._purpleBullet = null;
	this._eye = null;
	this._house = null;
}

MapIcons.prototype.dispose = function() {
	this._greenFlag = null;
	this._yellowFlag = null;
	this._redFlag = null;
	this._purpleBullet = null;
	this._eye = null;
	this._house = null;
}

MapIcons.prototype.getGreenFlag = function() {
	if (this._greenFlag == null) {
		this._greenFlag = new GIcon();
	  	this._greenFlag.image = "img/flag_green.png";
		this._greenFlag.iconSize = new GSize(16,16);
		this._greenFlag.shadowSize = new GSize(0,0);
		this._greenFlag.iconAnchor = new GPoint(10,16);
		this._greenFlag.infoWindowAnchor = new GPoint(20,-20);
		this._greenFlag.infoShadowAnchor = new GPoint(13,17);
	} 
	return this._greenFlag;
}

MapIcons.prototype.getYellowFlag = function() {
	if (this._yellowFlag == null) {
		this._yellowFlag = new GIcon();
	  	this._yellowFlag.image = "img/flag_yellow.png";
		this._yellowFlag.iconSize = new GSize(16,16);
		this._yellowFlag.shadowSize = new GSize(0,0);
		this._yellowFlag.iconAnchor = new GPoint(10,16);
		this._yellowFlag.infoWindowAnchor = new GPoint(20,-20);
		this._yellowFlag.infoShadowAnchor = new GPoint(13,17);
	} 
	return this._yellowFlag;
}

MapIcons.prototype.getRedFlag = function() {
	if (this._redFlag == null) {
		this._redFlag = new GIcon();
	  	this._redFlag.image = "img/flag_red.png";
		this._redFlag.iconSize = new GSize(16,16);
		this._redFlag.shadowSize = new GSize(0,0);
		this._redFlag.iconAnchor = new GPoint(10,16);
		this._redFlag.infoWindowAnchor = new GPoint(20,-20);
		this._redFlag.infoShadowAnchor = new GPoint(13,17);
	} 
	return this._redFlag;
}

MapIcons.prototype.getPurpleBullet = function() {
	if (this._purpleBullet == null) {
		this._purpleBullet = new GIcon();
		this._purpleBullet.image = "img/bullet_purple.png";
		this._purpleBullet.iconSize = new GSize(16,16);
		this._purpleBullet.shadowSize = new GSize(0,0);
		this._purpleBullet.iconAnchor = new GPoint(8,8);
		this._purpleBullet.infoWindowAnchor = new GPoint(8,8);
		this._purpleBullet.infoShadowAnchor = new GPoint(13,17);
	} 
	return this._purpleBullet;
}

MapIcons.prototype.getEye = function() {
	if (this._eye == null) {
		this._eye = new GIcon();
		this._eye.image = "img/eye.png";
		this._eye.iconSize = new GSize(16,16);
		this._eye.shadowSize = new GSize(0,0);
		this._eye.iconAnchor = new GPoint(7,7);
		this._eye.infoWindowAnchor = new GPoint(7,7);
		this._eye.infoShadowAnchor = new GPoint(13,17);
	} 
	return this._eye;
}

MapIcons.prototype.getHouse = function() {
	if (this._house == null) {
		this._house = new GIcon();
		this._house.image = "img/house.png";
		this._house.iconSize = new GSize(16,16);
		this._house.shadowSize = new GSize(0,0);
		this._house.iconAnchor = new GPoint(15,8);
		this._house.infoWindowAnchor = new GPoint(15,8);
		this._house.infoShadowAnchor = new GPoint(13,17);
	} 
	return this._house;
}


//-------------------------------------------------------------------------------------  Object nearPoints
function NearPointList(map) {
	this._center = null;
	this._nearPoints = [];
	this._nearMarkers = [];
	this._map = map;
}

NearPointList.prototype.getNearPoints = function() {
	return this._nearPoints;
}

NearPointList.prototype.getCenter = function() {
	return this._center;
}

NearPointList.prototype.getLength = function() {
	return this._nearPoints.length;
}

NearPointList.prototype.showInfo = function(id) {
	this._map.setCenter(this._nearPoints[id].getPoint());
	this._nearMarkers[id].openInfoWindowHtml(this._nearPoints[id].getInfoWindow());
	//maxdistancefromeye: return this._nearPoints[this._nearPoints.length-1].distance(this._center);
}

NearPointList.prototype.setCenter = function(center) {
	this._center = center;
	this.clearAll();
}

NearPointList.prototype.clearAll = function() {
	for (i = 0; i < this._nearMarkers.length; i++) {
		this._map.removeOverlay(this._nearMarkers[i]);
	}
	this._nearPoints = [];
	this._nearMarkers = [];
}

NearPointList.prototype.add = function(nearPointObject) {
	this._nearPoints.push(nearPointObject);
	
	var f = mapIcons.getHouse();

	temp = new GMarker(nearPointObject.getPoint(),
		{icon: f,
		 title: "Click to see information about this place."});
		
	this._nearMarkers.push(temp);
	document.map.addOverlay(temp);
	
	GEvent.addListener(temp, "click", function() {
		this.openInfoWindowHtml(nearPointObject.getInfoWindow());
	});
}
//-------------------------------------------------------------------------------------  Object NearPoint
function NearPoint(point, title, link, description, distanceFromEye, nearPlace) {
	this._point = point;
	this._title = title;
	this._link = link;
	this._description = description;
	this._distanceFromEye = distanceFromEye;//description.substring(6,description.indexOf("km")-1);
	this._nearPlace = nearPlace;//description.substring(description.indexOf("Near")+5,description.length-1);
								//substr(desc, strpos(desc, "Near"+5), count(desc)-1);
}
NearPoint.prototype.getPoint = function() {
	return this._point;
}
NearPoint.prototype.getTitle = function() {
	return this._title;
}
NearPoint.prototype.getLink = function() {
	return this._link;
}
NearPoint.prototype.getDescription = function() {
	return this._description;
}
NearPoint.prototype.getDistanceFromEye = function() {
	return this._distanceFromEye;
}
NearPoint.prototype.getNearPlace = function() {
	return this._nearPlace;
}
NearPoint.prototype.getDistanceFromOrigin = function() {
	//referencia a uma variavel fora do objeto!: marker
	return marker.getPoint().distanceFrom(this._point);
}
NearPoint.prototype.getInfoWindow = function() {
	result = '<div class="infoHouse">';
	result += _infoHeader(this._point, this.getDistanceFromOrigin());
	result += '<h3>'+this.getTitle();
	result += '</h3><span>'+this.getDescription()+'<br />';
	//result += this.getNearPlace() + ' '+ this.getDistanceFromEye() +'<br />';
	result += '<a href="'+this.getLink() +'" target="_blank" title="Access website">'+this.getLink().substring(7,30)+'...</a>';
	result += '</span></div>';
	
	return result;
}
NearPoint.prototype.toString = function() {
	return this._title +' - Point: '+ this._point.toString();
}
//-------------------------------------------------------------------------------------  Google EarthControl
function IfIWalkControl() {
}
IfIWalkControl.prototype = new GControl();

// Creates a one DIV for each of the buttons and places them in a container
// DIV which is returned as our control element. We add the control to
// to the map container and return the element for the map class to
// position properly.
IfIWalkControl.prototype.initialize = function(map) {
  var container = document.createElement("div");

  //Reset Button
  var resetDiv = document.createElement("div");
  this.setButtonStyle_(resetDiv);
  container.appendChild(resetDiv);
  //resetDiv.appendChild(document.createTextNode("Reset"));
  resetDiv.innerHTML = '<img src="img/reset.gif" border="0" title="Reset Map" width="24" height="24" />';
  GEvent.addDomListener(resetDiv, "click", function() {
    resetMap();
  });

  //Export KML button
  var exportDiv = document.createElement("div");
  exportDiv.id = "EarthExportButton";
  this._enabled = false;
  this.setButtonStyle_(exportDiv);
  container.appendChild(exportDiv);
  //exportDiv.appendChild(document.createTextNode("Export"));
  exportDiv.innerHTML = '<img src="img/google_earth_link.gif" border="0" title="See it on Google Earth" width="24" height="24" />';
  GEvent.addDomListener(exportDiv, "click", function() {
	if (iiwc._enabled) {
		googleEarthExport();
	} else {
		alert("You have draw a path first.");
	}
  });
  
  //Export Link
  var exportLinkDiv = document.createElement("div");
  exportLinkDiv.id = "LinkExportButton";
  this._enabled = false;
  this.setButtonStyle_(exportLinkDiv);
  container.appendChild(exportLinkDiv);
  //exportDiv.appendChild(document.createTextNode("Export"));
  exportLinkDiv.innerHTML = '<img src="img/exportLink.gif" border="0" title="Export your path as a web link" width="24" height="24" />';
  GEvent.addDomListener(exportLinkDiv, "click", function() {
	if (iiwc._enabled) {
		webLinkExport();
	} else {
		alert("You have draw a path first.");
	}
  });
  
  map.getContainer().appendChild(container);
  return container;
}

IfIWalkControl.prototype.setEnabled = function(state) {
  this._enabled = state;
}

// By default, the control will appear in the top left corner of the
// map with 7 pixels of padding.
IfIWalkControl.prototype.getDefaultPosition = function() {
  return new GControlPosition(G_ANCHOR_TOP_RIGHT, new GSize(7, 30));
}

// Sets the proper CSS for the given button element.
IfIWalkControl.prototype.setButtonStyle_ = function(button) {
  button.style.backgroundColor = "#ffc";
  button.style.border = "1px solid black";
  button.style.padding = "2px";
  button.style.height = "24px";
  button.style.marginBottom = "3px";
  button.style.textAlign = "center";
  button.style.width = "24px";
  button.style.cursor = "pointer";
}
//-------------------------------------------------------------------------------------  HelpControl
function HelpControl(iDoc) {
	this._iDoc = iDoc;
}
HelpControl.prototype = new GControl();

// Creates a one DIV for each of the buttons and places them in a container
// DIV which is returned as our control element. We add the control to
// to the map container and return the element for the map class to
// position properly.
HelpControl.prototype.initialize = function(map) {
  this._status = "show";
  
  var container = document.createElement("div");

  this._helpDiv = document.createElement("div");
  this._helpDiv.className = "help";
  this.setButtonStyle_(this._helpDiv);
  container.appendChild(this._helpDiv);
  //resetDiv.appendChild(document.createTextNode("Reset"));
  this._helpDiv.innerHTML = '<div id="helpIcon"><a href="Javascript: help.changeStatus()" title="Click to show/hide quick help"><img src="img/help.gif" border="0" title="Click to show/hide quick help" /></a></div><div id="activeHelp"></div>';
  map.getContainer().appendChild(container);
  this._currentHelp = "nothing";
  
  return container;
}

HelpControl.prototype.setActiveHelp = function(helpId) {
	this._previousHelp = this._currentHelp;
	this._currentHelp = helpId;
	$('activeHelp').innerHTML = this._iDoc.getElementById(helpId).innerHTML;
}

HelpControl.prototype.getActiveHelp = function(helpId) {
	return this._currentHelp;
}

HelpControl.prototype.changeStatus = function() {
	if (this._status == "show") {
		this._status = "hide";
		this.setButtonStyleHide_(this._helpDiv);
	} else if (this._status == "hide") {
		this._status = "show";
		this.setButtonStyle_(this._helpDiv);
	}
}

// By default, the control will appear in the top left corner of the
// map with 7 pixels of padding.
HelpControl.prototype.getDefaultPosition = function() {
  return new GControlPosition(G_ANCHOR_BOTTOM_RIGHT, new GSize(7, 20));
}

// Sets the proper CSS for the given button element.
HelpControl.prototype.setButtonStyle_ = function(button) {
  button.style.width = "340px";
  button.style.height = "36px";
  button.style.overflow = "auto";
}

// Sets the proper CSS for the given button element.
HelpControl.prototype.setButtonStyleHide_ = function(button) {
  button.style.width = "16px";
  button.style.height = "16px";
  button.style.overflow = "hidden";
}