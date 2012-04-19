<?php
/* Near Point HTML Generator  by Cipriani: functions to generate the near points in HTML
 */
function getHeader() {
	$result = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">';
	$result .= '<html xmlns="http://www.w3.org/1999/xhtml">';
	$result .= '<head><title>*****</title>';
	$result .= '<meta http-equiv="content-type" content="text/html; charset=utf-8" />';
	$result .= '<meta name="author" content="Luis Felipe Cipriani"/>';
	$result .= '<meta name="description" content="If I walk in straight line around the world, where will I pass?"/>';
	$result .= '<meta name="keywords" content="walk straight line google maps"/>';
	$result .= '<style type="text/css" media="screen">@import url("stylesheets/npDefault.css");</style>';
	$result .= '<link rel="stylesheet" type="text/css" href="stylesheets/npDefault.css" title="default" media="screen" />';
	$result .= '<script type="text/javascript" src="scripts/npControl.js"></script></head><body><div id="nearPoints"><ul>';
	return $result;
}

function getTop($numResults, $radius) {
	$result = '<li><b>Showing '.$numResults.' near place(s).</b><br />';
	$result .= 'Click on titles to view a place on map.<br />';
	$result .= 'Powered by <a href="http://geourl.org/" title="GeoURL" ><img src="img/geourl.png" title="GeoURL" border="0" alt="GeoURL"/></a></li>';
	return $result;
}

function getBottom() {
	return '</ul></div>
	
</body>
</html>';
}

function getNoPoints() {
	$result = '<li><p><b>Sorry, no points near by.</b>
<br /><br />
Some possible reasons to it:
<br /><br />
- You chose to view the near by points on less populated places or in sea areas, in this case, try on more populated land areas;
<br /><br />
- You chose a range of low value, in this case, increase the value;
<br /><br />
- The webservice is down or returned an error code, in this case, we ask you to try again later;
<br /><br />
You can try again by just clicking on another place on map.
</p></li>';

	return $result;
}

function generateNPHTML($id, $latitude, $longitude, $link, $title, $description, $nearPlace, $distanceFromEye) {
	$result = '<li>';
	$result .= '<pre>';
	$result .= '	<div class="geo">'.$title.': ';
	$result .= '		<abbr class="latitude" title="'.$latitude.'">'.$latitude.'</abbr>, ';
	$result .= '		<abbr class="longitude" title="'.$longitude.'">'.$longitude.'</abbr>';
	$result .= '	</div>';
	$result .= '	<div class="link">'.$link.'</div>';
	$result .= '	<div class="title">'.$title.'</div>';
	$result .= '	<div class="description">'.$description.'</div>';
	$result .= '	<div class="nearPlace">'.$nearPlace.'</div>';
	$result .= '	<div class="distanceFromEye">'.$distanceFromEye.'</div>';
	$result .= '</pre>';
	$result .= '<a name="'.$id.'" href="Javascript: parent.npl.showInfo('.$id.');" title="Click to show this on map"><img src="img/showPoint.gif" border="0" alt="Show on Map" title="Click to show this on map"/></a>';
	$result .= '<a href="Javascript: parent.npl.showInfo('.$id.');" title="Click to show this on map"><h3>'.$title.'</h3></a>';
	$result .= '<p>'.$description.'<br />';
	//$result .= ' '.$nearPlace.'<br />';
	//$result .= ' '.$distanceFromEye.'<br />';
	$result .= '<a href="'.$link.'" target="_blank" class="npLink" title="Access website">'.substr($link, 7, 30).'...</a></p>';
	$result .= '</li>';
	return $result;
}

function getAdsense($type) {
	$result = "<li>Problem with Adsense</li>";
	if (strcmp($type,"125X125")==0) {
		//$result = '<li><img src="img/125x125.gif" /></li>';
		
		$result = '';
	} else if (strcmp($type,"120X240")==0) {
		//$result = '<li><img src="img/120x240.gif" /></li>';
		$result = '';
	}
	return $result;
}
?>