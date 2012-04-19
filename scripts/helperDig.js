// MAP ICONS
function MapIcons() {
	this._greenFlag = null;
	this._redFlag = null;
}

MapIcons.prototype.dispose = function() {
	this._greenFlag = null;
	this._redFlag = null;
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
  
  //Export Link
  var exportLinkDiv = document.createElement("div");
  exportLinkDiv.id = "LinkExportButton";
  this._enabled = false;
  this.setButtonStyle_(exportLinkDiv);
  container.appendChild(exportLinkDiv);
  //exportDiv.appendChild(document.createTextNode("Export"));
  exportLinkDiv.innerHTML = '<img src="img/exportLink.gif" border="0" title="Export your hole as a web link" width="24" height="24" />';
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
  this._currentHelp = "start";
  
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