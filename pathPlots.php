<?
	$runSQL = true;
	
	if (isset($_GET['lat']))
		$prLat = $_GET['lat'];
	else 
		$runSQL = false;
		
	if (isset($_GET['lng']))
		$prLng = $_GET['lng'];
	else 
		$runSQL = false;
		
	if (isset($_GET['dir']))
		$prDir = $_GET['dir'];
	else 
		$runSQL = false;
		
	if (isset($_GET['rel']))
		$prRel = $_GET['rel'];
	else 
		$runSQL = false;
		
	$prLatend = $_GET['latend'];
	$prLngend = $_GET['lngend'];
	
	if ($runSQL) {
	
		$data = date("Y-m-d H:i:s");
		
		if ($prDir >= 0 && $prDir < 90)
			$quadrante = 1;
		else if ($prDir >= 90 && $prDir < 180)
			$quadrante = 2;
		else if ($prDir >= 180 && $prDir < 270)
			$quadrante = 3;
		else $quadrante = 4;
		
		$ip = $_SERVER['REMOTE_ADDR'];
	
		include("db/dbconnect.php");	
	
	    $sql = "INSERT INTO `pathplots` 
				( `lat` , `lng` , `dir` , `rel` , `latend` , `lngend` , `datetime` , `quadrante` , `ip` )
				VALUES 
				('$prLat', '$prLng', '$prDir', '$prRel', $prLatend , $prLngend , '$data', '$quadrante', '$ip')";

	    $sql_result = mysql_query($sql, $connection);

	    /*if ($sql_result) {
		}*/
		
	    mysql_close($connection);
	}

?>