<?php
	$lang = $_GET["lang"];
	if (!isset($_GET["lang"])) {
		$lang = "en";
	}

	if (strcmp($lang,"en") == 0) {

		$title = "If I dig a very deep hole, where I go to stop?";
		$intro = "<p>Are you concerned about where you go to arrive if you dig a very deep straight infinite hole on Earth?<br />Your problems are solved!<br /><br />Surf on the map below, find where you will dig your hole and click there.<br />After this, click on \"Dig here!\" and you will see the place where, one day, you will (believe me) put your feet.<br /><br /><i>\"Earth: Dig it, but dig it right.\"</i></p>";
		$linkTitle = "Click here to see the other side.";
		$digHere = "Dig here!";
		$tip = "<p>Tip: Not all places have high level zoom, therefore, some hole´s ends are not shown in the desired level of details (Especially on sea points).<br /><br />Developed by: Luis Cipriani (Brazil)</p>";
		$zoomOut = "See all map (full zoom out)";
		$zoomOutTitle = "Zoom out";
		$subTitle = "Another stupid application for Google Maps...";
		$endHere = "Your hole ends here!";
		$warning = "Atention! This site is not responsible for bank, house or any establishment assaults occured by holes made by our users.";
		$guestLang = "en";
		$signUp = "Please, donate to guestMap. Or just see it (this isn´t a stupid application for Google Maps).";
		$mapsMania = "Featured on Google Maps Mania";
		$stanford = "In accordance with Stanford, this application isn´t so stupid.";
		$stanfordTitle = "Stanford Persuasive Technology Lab";
		$mapsManiaTitle = "An unofficial Google Maps blog tracking the websites, ideas and tools being influenced by Google Maps.";

	} else if (strcmp($lang,"pt") == 0) {

		$title = "Se eu cavar um buraco muito fundo, aonde eu vou parar?";
		$intro = "<p>Você está preocupado aonde vai chegar se você cavar um buraco infinitamente fundo e muito reto na Terra?<br />Seus problemas acabaram!<br /><br />Navegue pelo mapa abaixo, ache o lugar onde irá cavar o buraco e clique lá.<br />Depois, clique em \"Cavar aqui!\" e verá o lugar onde, um dia, colocará (acredite) seus pés.<br /><br /><i>\"Terra: Cave, mas cave certo.\"</i></p>";
		$linkTitle = "Clique aqui para ver o outro lado do mundo.";
		$digHere = "Cavar aqui!";
		$tip = "<p>Dica: Nem todos os lugares possuem um nível alto de zoom, portanto, alguns fins de buraco não são mostrados nesses certos nívels de zoom desejados (Especialmente nos pontos que estão em alto mar).<br /><br />Desenvolvido por: Luis Felipe (Brasil)</p>";
		$zoomOut = "Ver todo o mapa-mundi (zoom out)";
		$zoomOutTitle = "Zoom out";
		$subTitle = "Mais uma aplicação estúpida para o Google Maps...";
		$endHere = "Seu buraco acaba aqui!";
		$warning = "Atenção! Este site não se responsabiliza por qualquer assalto à banco, casa ou qualquer outro estabelecimento ocorridos pelos buracos feitos por nossos usuários.";
		$guestLang = "pt";
		$signUp = "Por favor, doe dinheiro para o MyGuestMap. Ou apenas veja (essa não é uma aplicação estúpida para o Google Maps).";
		$mapsMania = "Publicado no Google Maps Mania";
		$stanford = "De acordo com a universidade de Stanford nos EUA, essa aplicação não é tão estúpida assim.";
		$stanfordTitle = "Laboratório de Tecnologia Persuasiva de Stanford (Stanford Persuasive Technology Lab)";
		$mapsManiaTitle = "An unofficial Google Maps blog tracking the websites, ideas and tools being influenced by Google Maps.";
		$fabio = "<br /><a href=\"http://blog.serendipidade.com\" title=\"Site sobre comportamento, cotidiano, criatividade e inovação\">Serendipidade, ou mero acaso?</a><br />";

	}

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="<?php echo $lang; ?>">
<head>
<meta http-equiv="content-type" content="text/html; charset=iso-8859-1" />
<meta name="author" content="Luis Felipe Cipriani (Brazil)"/>
<meta name="description" content="If I dig a very deep hole, where I go to stop? Find the end of your hole."/>
<meta name="keywords" content="google, map, deep, hole, other side, earth"/>
<script src="http://maps.google.com/maps?file=api&amp;v=1&amp;key=ABQIAAAA0uA357CkpYZ4NhE62ApMdRS5VQAtFbmZ9-2D15ntmOlW1theThQ6eLKLO-8KmWY5RFwvFe6wjQR2EQ" type="text/javascript"></script>
<!--<style type="text/css" media="screen">@import "style.css";</style>-->
<title><?php echo $title; ?></title>
</head>
<body>


	<h1><?php echo $title; ?></h1>
	<p><i><?php echo $subTitle; ?></i></p>

	<hr />

	<div style="float: right">
	
	</div>


	<p>
	<a href="index.php?lang=pt" title="Português"><img src="brazil-flag.gif" width="30" height="20" style="border: 0px;" alt="Português"></a>
	<a href="index.php?lang=en" title="English"><img src="united-kingdom-flag.gif" width="30" height="20" style="border: 0px;" alt="English"></a>
	</p>

	<a href="../bighole.php">Back to new version</a>
	
	<?php echo $intro; ?>

	<div id="map" style="width: 500px; height: 400px"></div>
    <script type="text/javascript">
    //<![CDATA[

    var map = new GMap(document.getElementById("map"));
    var superPoint;
    map.addControl(new GLargeMapControl());
	map.addControl(new GMapTypeControl());
	map.setMapType(G_HYBRID_TYPE);
    map.centerAndZoom(new GPoint(0, 0), 16);

    GEvent.addListener(map, 'click', function(overlay, point) {
		if (overlay) {
			// nothing
		} else {
			map.clearOverlays();
			superPoint = point;
			var marker = map.addOverlay(new GMarker(point));
			var html = '<a href="javascript: otherSide()" title="<?php echo $linkTitle; ?>"><?php echo $digHere; ?></a>';
			map.openInfoWindowHtml(point, html);
		}
	});

	function otherSide() {
		map.closeInfoWindow();

		var y = -1 * superPoint.y;
		if (superPoint.x < 0) {
			var x = Math.abs(superPoint.x);
			x = 180 - x;
		} else {
			var x = superPoint.x;
			x = 180 - x;
			x = -1 * x;
		}

		var newPoint = new GPoint(x,y);
		var marker = map.addOverlay(new GMarker(newPoint));
		var html = '<?php echo $endHere; ?>';
		map.openInfoWindowHtml(newPoint, html);

		map.recenterOrPanToLatLng(newPoint);
	}

	function zoomOut() {
		map.centerAndZoom(new GPoint(0, 0), 16);
	}

    //]]>
    </script>
    <a href="javascript: zoomOut()" title="<?php echo $zoomOutTitle; ?>"><?php echo $zoomOut; ?></a>

	<?php echo $tip; ?>

	<br /><br />
	<a href="http://googlemapsmania.blogspot.com" title="<?php echo $mapsManiaTitle; ?>"><?php echo $mapsMania; ?></a><br />
	<a href="http://credibility.stanford.edu/captology/notebook/archives.new/2005/09/index.html" title="<?php echo $stanfordTitle; ?>"><?php echo $stanford; ?></a><br />
	<?php echo $fabio; ?>

	<h5 style="color: red"><?php echo $warning; ?></h5>

	<h5>Copyright 2005 &copy; If I dig a very deep hole, where I go to stop? All rights reserved<br />
	Google Maps mapping service - is a trademark of Google Inc.</h5>

	<hr />

	<p>
	<a href="http://www.pequenopolis.com">
		  	<img style="border:0;"
		       src="logo2.jpg"
		       alt="Hosted By Pequenopolis"
		       title="Hosted by Pequenopolis"/>
 	</a>

 

      <a href="http://validator.w3.org/check?uri=referer"><img
          src="http://www.w3.org/Icons/valid-xhtml10" style="border: 0px"
          alt="Valid XHTML 1.0!" height="31" width="88" /></a>

      <a href="http://jigsaw.w3.org/css-validator/">
  	<img style="border:0;width:88px;height:31px"
       src="http://jigsaw.w3.org/css-validator/images/vcss"
       alt="Valid CSS!" />
 	</a>

    </p>


</body>

</html>



