compassImgValues = new Array(0, 7, 15, 22, 30, 
	37, 45, 52, 60, 67, 75, 82, 90, 97, 105, 
	112, 120, 127, 135, 142, 150, 157, 165, 
	172, 180, 187, 195, 202, 210, 217, 225, 
	232, 240, 247, 255, 262, 270, 277, 285, 
	292, 300, 307, 315, 322, 330, 337, 345, 352, 360);

// Compass Object
function Compass() {
  this.latlng_ = null;
  this.value_ = "030";
  this.path_ = "scripts/img/"; 
  
  this.initialize(document.map);
}
//Compass.prototype = new GOverlay();

// Creates the DIV representing this compass.
Compass.prototype.initialize = function(map) {
  var div = document.createElement("div");
  div.id = "compass";
  
  this.image_ = document.createElement("img");
  this.setValue(this.value_);
  div.appendChild(this.image_);
  
  map.getPane(G_MAP_MARKER_SHADOW_PANE).appendChild(div);
  
  this.show_ = false;
  this.map_ = map;
  this.div_ = div;
}

// Set the value of compass, in degress -> value: String (ex.: "030")
Compass.prototype.setValue = function(value) {
	this.value_ = value;
	this.image_.src = this.path_+"p"+value+".gif";
}

// Get the value of compass, in degress -> value: String (ex.: "030")
Compass.prototype.getValue = function() {
	return this.value_;
}

// Show the compass
Compass.prototype.show = function() {
	this.show_ = true;
	this.div_.style.display = "block";
}

// Hide the compass
Compass.prototype.hide = function() {
	this.show_ = false;
	this.div_.style.display = "none";
}

// Remove the main DIV from the map pane
Compass.prototype.remove = function() {
  this.div_.parentNode.removeChild(this.div_);
}

// Copy our data to a new Compass
Compass.prototype.copy = function() {
  return new Compass(this.latlng_, this.value_);
}

// Draw the compass based on the current point and value
Compass.prototype.draw = function(latlng, value) {
	this.latlng_ = latlng;
	var c1 = this.map_.fromLatLngToDivPixel(this.latlng_);
	
	this.div_.style.left = (c1.x - 44) + "px";
	this.div_.style.top = (c1.y - 44) + "px";
	this.setValue(value);
	this.show();
}