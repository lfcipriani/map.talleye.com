<?
	include 'include/functionlib.php';
	
	$prLat = $_GET['lat'];
	$prLng = $_GET['lng'];
	
	// validation VALIDAR ISSO DIREITO
	$varURL = true;
	if (!isset($prLat) || !($prLat = isFloat($prLat, array('single_dot_as_decimal'=> TRUE)))) $varURL = false;
	if (!isset($prLng) || !($prLng = isFloat($prLng, array('single_dot_as_decimal'=> TRUE)))) $varURL = false;
	
	$titleThis = "If I dig a very deep hole, where will I end up?";
	
	if ($varURL) $onLoadFunction = "createWithVars($prLat, $prLng)";
	else $onLoadFunction = "createMap()";
	
	$mapTitleLink = '<img src="img/digMapTitle.gif" border="0" width="400" height="40" alt="Dig your hole"/>';
	$linkToThis = "http://map.talleye.com/bighole.php";
	$prKnd = "cyd";
    
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
	
	<title>Tall Eye - If I dig a very deep hole, where will I end up?</title>
	<!-- Titulo da pagina -->
	
	<!-- Declaracao de meta tags -->
	<meta http-equiv="content-type" content="text/html; charset=iso-8859-1" />
	<meta name="author" content="Luis Felipe Cipriani"/>
	<meta name="description" content="If I dig a very deep hole, where will I end up?"/>
	<meta name="keywords" content="[keywords]"/>
	
	<!-- Stylesheets para as midias screen e print -->
	<style type="text/css" media="screen">@import url("stylesheets/defaultDig.css");</style>
	<link rel="stylesheet" type="text/css" href="stylesheets/defaultDig.css" title="default" media="screen" />
	<!--<link rel="stylesheet" type="text/css" href="stylesheets/print.css" media="print" />
	<link rel="alternate stylesheet" type="text/css" href="stylesheets/alternate01.css" title="alternate01" media="screen" />-->
	
	<!-- Declaracao de scripts Javascript -->
	<script src="http://maps.google.com/maps?file=api&amp;v=2&amp;key=ABQIAAAA0uA357CkpYZ4NhE62ApMdRS5VQAtFbmZ9-2D15ntmOlW1theThQ6eLKLO-8KmWY5RFwvFe6wjQR2EQ" type="text/javascript"></script>
	<script type="text/javascript" src="scripts/prototype.js" ></script>
	<script type="text/javascript" src="scripts/helperDig.js"></script>
	<script type="text/javascript" src="scripts/earth.js"></script>
    <script type="text/javascript" src="scripts/controlDig.js"></script>
</head>

<body onload="<? echo $onLoadFunction ?>" onunload="GUnload()">

<a name="topo"></a>

<div id="top">
	<span>Div #top</span>
</div> <!-- #top -->

<div id="header">
	<div id="headerP1">&nbsp;</div>
	<div id="headerP2">&nbsp;</div>
	<h1>
		<img src="img/titleDig.jpg" border="0" width="265" height="47" alt="If I dig a very deep hole, where will I end up?" />
	</h1>
</div> <!-- #header -->

<div id="menuBar">
	<a name="onLinking"></a>
	<div id="menuBarP1">&nbsp;</div>
	<div id="menuBarP2">&nbsp;</div>
	<p>
		<a href="bighole.php" title="Website home">home</a></a><span class="orange"> . </span>
		<a href="about.php" title="Website home">about</a><span class="orange"> . </span>
		<a href="news.php" title="Website home">news</a><span class="orange"> . </span>
		<a href="contact.php?knd=bug" title="Website home">report bug</a><span class="orange"> . </span>
		<a href="contact.php" title="Website home">contact</a><span class="orange"> . </span>
		<a href="#mapAnchor" title="Website home"><span class="little">just show me the map</span></a>
	</p>
</div> <!-- #menuBar -->


<div id="content">

	<div id="adsenseDiv">

	</div> <!-- adsenseDiv -->

	<div id="navigation">
		<h2>Try our other mashups!</h2>
		<p><br /><br >
		
			<a href="index.php?knd=cyd" title="Walk choosing your direction"><img src="img/cydNavTitle.gif" border="0" width="195" height="40" alt="CYDimg"/></a>
		
			<br /><br >
		
			<a href="index.php?knd=cwp" title="Walk choosing where to pass"><img src="img/cwpNavTitle.gif" border="0" width="195" height="40" alt="CWPimg"/></a>
			
		</p>
	</div> <!-- #navigation -->

	<div id="mainContent">
		<h2>Earth: Dig it, but dig it right.</h2>
		<p><br />
			Are you concerned about where you go to arrive if you dig a very deep straight infinite hole on Earth?
Your problems are solved!
			<br /><br />
Surf on the map below, choose where you will dig your hole and click there.
After this, click on "Dig here!" and you will see the place where, one day, you will (believe me) put your feet.
			<br /><br />
			This website was redesigned. <a href="oldversion/index.php">See the old version</a>.
		</p>
	</div> <!-- #mainContent -->

	<div id="mapContainer">
		<a name="mapAnchor"></a>
		<div id="mapHeader">
			<form method="post" id="centerMapForm" action="javascript:void(0)" onsubmit="centerMap()">
			Search Places (eg. Sao Paulo, Brazil):<br /><input id="txtAddress" type="text">
			<input value="Search" type="submit">
			</form>
			<?= $mapTitleLink ?>
		</div>
		<div id="map"></div>
		<iframe src="include/i18n-en.htm" name="i18n" id="i18nID"></iframe>
			
	</div> <!-- #mapConteiner -->
	
	<div class="left">
	
	</div>
	<div class="right">
	<p class="externalLinks">
		<a name="exportLinkAnchor"></a>

		<a title="Add to Blinklist!" href="http://www.blinklist.com/index.php?
		Action=Blink/addblink.php&Url=<?=$linkToThis?>&Title=<?=$titleThis?>"><img width="16" border="0" height="16" src="img/blinklist.png" alt="Add to Blinklist!"/></a>&nbsp;&nbsp;

		<a title="Add to Delicious!" href="http://del.icio.us/post?url=<?=$linkToThis?>&title=<?=$titleThis?>"><img width="16" border="0" height="16" src="img/delicious.gif" alt="Add to Delicious!"/></a>&nbsp;&nbsp;

		<a title="Add to Digg!" href="http://digg.com/submit?phase=2&url=<?=$linkToThis?>"><img width="16" border="0" height="16" src="img/digg.png" alt="Add to Digg!"/></a>&nbsp;&nbsp;

		<a title="Add to Fark!" href="http://cgi.fark.com/cgi/fark/edit.pl?new_url=<?=$linkToThis?>&new_comment=<?=$titleThis?>"><img width="16" height="16" border="0" src="img/fark.png" alt="Add to Fark!"/></a>&nbsp;&nbsp;

		<a title="Add to Furl!" href="http://www.furl.net/storeIt.jsp?t=<?=$titleThis?>&u=<?=$linkToThis?>"><img width="16" border="0"  height="16" src="img/furl.png" alt="Add to Furl!"/></a>&nbsp;&nbsp;

		<a title="Add to Kinja!" href="http://kinja.com/id.knj?url=<?=$linkToThis?>"><img width="16" border="0" height="16" src="img/kinja.png" alt="Add to Kinja!"/></a>&nbsp;&nbsp;

		<a title="Add to Ma.gnolia!" href="http://ma.gnolia.com/bookmarklet/add?url=<?=$linkToThis?>&title=<?=$titleThis?>"><img width="16" height="16" border="0" src="img/ma.gnolia.png" alt="Add to Ma.gnolia!"/></a>&nbsp;&nbsp;

		<a title="Add to Reddit!" href="http://reddit.com/submit?url=<?=$linkToThis?>&title=<?=$titleThis?>"><img width="16" border="0" height="16" src="img/reddit.png" alt="Add to Reddit!"/></a>&nbsp;&nbsp;

		<a title="Save to Newsvine!" href="http://www.newsvine.com/_tools/seed&save?u=<?=$linkToThis?>&h=<?=$titleThis?>"><img width="16" border="0"  height="16" src="img/newsvine.png" alt="Save to Newsvine!"/></a>&nbsp;&nbsp;

		<a title="Add to Shadows!" href="http://www.shadows.com/features/tcr.htm?url=<?=$linkToThis?>&title=<?=$titleThis?>"><img width="16" height="16" border="0" src="img/shadows.png" alt="Add to Shadows!"/></a>&nbsp;&nbsp;

		<a title="Add to Spurl!" href="http://www.spurl.net/spurl.php?url=<?=$linkToThis?>&title=<?=$titleThis?>"><img width="16" border="0" height="16" src="img/spurl.png" alt="Add to Spurl!"/></a>&nbsp;&nbsp;

		<a title="Add to Wink!" href="http://www.wink.com/_/tag?url=<?=$linkToThis?>&doctitle=<?=$titleThis?>"><img width="16" border="0" height="16" src="img/wink.png" alt="Add to Wink!"/></a>&nbsp;&nbsp;

		<a title="Add to Wists!" href="http://wists.com/r.php?c=&r=<?=$linkToThis?>&title=<?=$titleThis?>"><img width="16" border="0"  height="16" src="img/wists.png" alt="Add to Wists!"/></a><br />
		<i>Bookmark us in your favorite website</i>
	</p>
	</div>
	
	<p class="externalLinks clearBoth">

	</p>
	
	<div id="exportLinkDiv">
		<fieldset>
			<legend><b>Your Hole as a Web Link</b></legend>
			With the link below, you can show to everyone the hole that you will dig.<br />
			Select and copy the URL and then send by email, put on your webpage, click on it, do everything you want...
			<div id="exportLinkValue"><a href="#" id="exportLinkTest" target="_blank"><?=$linkToThis?></a></div>
		</fieldset>
	</div>
	
	
	<div id="nothing"></div>
	<p class="tinyText">Okay, if don't understand the soft humor of this website and still want to dig a huge hole, please remeber this: The information generated by this website may not be accurate or current and is not valid for navigation, dig, or flight planning. No warranty of fitness for any purpose is made or implied. Thank you for visiting us!</p>
	
</div> <!-- #content -->

<div id="footer">
	<div id="footerP1"></div>
	<div id="footerP2"></div>
	<span>&copy;2007  Tall Eye. All rights reserved.</span>
</div> <!-- #footer -->


</body>

</html>