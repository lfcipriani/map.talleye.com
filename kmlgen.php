<?php

class LatLng
{
	var $lat;
	var $lng;

	function LatLng($lt, $ln) {
		$this->lat = $lt;
		$this->lng = $ln;
    }
	
	function getLat()
	{
	   return $this->lat;
	}
	
	function getLng()
	{
	   return $this->lng;
	}
	
	function getRadLat()
	{
	   return $this->lat * pi() / 180;
	}
	
	function getRadLng()
	{
	   return $this->lng * pi() / 180;
	}
	
	function setLat($newLat)
	{
	   $this->lat = $newLat;
	}
	
	function setLng($newLng)
	{
	   $this->lng = $newLng;
	}
}

function destPoint($point, $bearing, $distance) {
	$earthRadius = 6371;
	$d = $distance / $earthRadius;
	$bearing = $bearing * pi() / 180;
	
	$p2Lat = asin( sin($point->getRadLat())* cos($d) + cos($point->getRadLat())* sin($d)* cos($bearing) );
	$p2Lng = $point->getRadLng() + atan2(sin($bearing)*sin($d)*cos($point->getRadLat()), cos($d)-sin($point->getRadLat())*sin($p2Lat));
	
	return new LatLng($p2Lat*180/pi(), $p2Lng*180/pi());
}

function bearing($pt1, $pt2) {
	$y = sin($pt2->getRadLng() - $pt1->getRadLng()) * cos($pt2->getRadLat());
	$x = cos($pt1->getRadLat()) * sin($pt2->getRadLat()) - sin($pt1->getRadLat()) * 
		cos($pt2->getRadLat()) * cos($pt2->getRadLng()- $pt1->getRadLng());
	$temp = atan2($y, $x);
	
	return $temp;
}

function finalBrng($ptStart, $ptEnd) {
	
	// get reverse bearing point 2 to point 1 & reverse it by adding 180º
	
	$h2 = fmod((bearing($ptEnd, $ptStart) + pi()),(2*pi()));
	
	return $h2 * 180/pi();
}

function fixPoint($pt) {
	if ($pt->getLng() > 180) {
		$pt->setLng($pt->getLng() - 360);
	} else if ($pt->getLng() < -180) {
		$pt->setLng($pt->getLng() + 360);
	}

	// reach high latitude?
	if ($pt->getLat() > 90) {
		$pt->setLat(90);
	} else if ($pt->getLat() < -90) {
		$pt->setLat(-90);
	}
	
	return $pt;
}

$pointLat = $_GET["lat"];
$pointLng = $_GET["lng"];
$direction = $_GET["hdn"];

$initPoint = new LatLng(0+$pointLat, 0+$pointLng);

$numPoints = 8; 	//  4		8
$resolution = 5000; // 10000     5000

$p[0] = $initPoint;
$p[0] = fixPoint($p[0]);
$b[0] = $direction;

for ($i = 1; $i < $numPoints; $i++) {
	$p[$i] = destPoint($p[$i-1], $b[$i-1], $resolution);
	$b[$i] = finalBrng($p[$i-1], $p[$i]);
	$p[$i] = fixPoint($p[$i]);
}

$p[$numPoints] = $p[0];
$b[$numPoints] = $b[0];

$filename = "pequenopolis";
$path = "";
header("Content-Type: application/kml; charset=utf8");
header('Content-Disposition: attachment; filename="'.$filename.'.kml"');
echo '<?xml version="1.0" encoding="UTF-8"?>'. "\n";
echo '<kml xmlns="http://earth.google.com/kml/2.1">'. "\n";
echo '<Document><Folder>'. "\n";
echo '<name>Tall Eye - Path Export</name>'. "\n";
echo '<open>1</open><description>

<![CDATA[
If you walk from coordinate <b>('.$p[0]->getLat().','.$p[0]->getLng().')</b> with a direction of <b>'.$b[0].'</b> degrees, you will pass exactly
on path drawn by this KML file.
<br /><br />
Click on "Play Tour" button to see where you will pass.
<br /><br />
<a href="http://map.talleye.com/index.php?knd=cyd&lat='.$p[0]->getLat().'&lng='.$p[0]->getLng().'&dir='.$b[0].'&rel=1000">See this path in our website</a>
<br /><br />
This KML was created on http://map.talleye.com in '.date("Y-m-d H:i:s").'
]]>
</description>'. "\n";
echo "<LookAt>
			<longitude>".$p[0]->getLng()."</longitude>
			<latitude>".$p[0]->getLat()."</latitude>
			<altitude>0</altitude>
			<range>10579638.83293044</range>
			<tilt>0</tilt>
			<heading>".$b[0]."</heading>
		</LookAt>";

for ($i = 0; $i < count($p); $i++) {

	echo "<Placemark>
			<name>". ($i*$resolution) ." km</name>
			<LookAt>
				<longitude>".$p[$i]->getLng()."</longitude>
				<latitude>".$p[$i]->getLat()."</latitude>
				<range>300000</range>
				<tilt>60</tilt>
				<heading>".$b[$i]."</heading>
			</LookAt>
			<Point>
				<coordinates>".$p[$i]->getLng().",".$p[$i]->getLat().",0</coordinates>
			</Point>
		</Placemark>";
		
	$path .= $p[$i]->getLng().",".$p[$i]->getLat().",0 ";
		
}
echo "<Placemark>
			<name>Path</name>
			<LookAt>
				<longitude>".$p[0]->getLng()."</longitude>
				<latitude>".$p[0]->getLat()."</latitude>
				<altitude>0</altitude>
				<range>300000</range>
				<tilt>60</tilt>
				<heading>".$b[0]."</heading>
			</LookAt>
			<LineString>
				<tessellate>1</tessellate>
				<coordinates>
				".$path."
</coordinates>
			</LineString>
		</Placemark>";
echo '</Folder>'. "\n";
echo '</Document>'. "\n";
echo '</kml>';

?>