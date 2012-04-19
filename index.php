<?
	include 'include/functionlib.php';
	
	$prKnd = $_GET['knd'];
	$prLat = $_GET['lat'];
	$prLng = $_GET['lng'];
	$prDir = $_GET['dir'];
	$prRel = $_GET['rel'];
	
	// validation VALIDAR ISSO DIREITO
	$varURL = true;
	if (!isset($prLat) || !($prLat = isFloat($prLat, array('single_dot_as_decimal'=> TRUE)))) $varURL = false;
	if (!isset($prLng) || !($prLng = isFloat($prLng, array('single_dot_as_decimal'=> TRUE)))) $varURL = false;
	if (!isset($prDir) || !($prDir = isFloat($prDir, array('single_dot_as_decimal'=> TRUE)))) $varURL = false;
	if (($prRel != '1000') && ($prRel != '500') && ($prRel != '250')) $prRel = "1000";
	
	$titleThis = "If I walk in a straight line around the world, where will I pass?";
	// deciding what site will open
	switch ($prKnd) {
	    case "cyd":
			if ($varURL) $onLoadFunction = "createWithVars(1, $prLat, $prLng, $prDir, $prRel)";
			else $onLoadFunction = "createMap()";
			$navLink = '<a href="index.php?knd=cwp" title="Walk choosing where to pass"><img src="img/cwpNavTitle.gif" border="0" width="195" height="40" alt="CWPimg"/></a>';
			$mapTitleLink = '<img src="img/cydMapTitle.gif" border="0" width="400" height="40" alt="Choose your direction"/>';
			$linkToThis = "http://map.talleye.com/index.php";
	        break;
	    case "cwp":
	        if ($varURL) $onLoadFunction = "createWithVars(2, $prLat, $prLng, $prDir, $prRel)";
			else $onLoadFunction = "createMap2()";
			$navLink = '<a href="index.php?knd=cyd" title="Walk choosing your direction"><img src="img/cydNavTitle.gif" border="0" width="195" height="40" alt="CYDimg"/></a>';
			$mapTitleLink = '<img src="img/cwpMapTitle.gif" border="0" width="400" height="40" alt="Choose where to pass"/>';
			$linkToThis = "http://map.talleye.com/index.php?knd=cwp";
	        break;
	    default:
			if ($varURL) $onLoadFunction = "createWithVars(1, $prLat, $prLng, $prDir, $prRel)";
			else $onLoadFunction = "createMap()";
			$navLink = '<a href="index.php?knd=cwp" title="Walk choosing where to pass"><img src="img/cwpNavTitle.gif" border="0" width="195" height="40" alt="CWPimg"/></a>';
			$mapTitleLink = '<img src="img/cydMapTitle.gif" border="0" width="400" height="40" alt="Choose your direction"/>';
			$linkToThis = "http://map.talleye.com/index.php";
			$prKnd = "cyd";
	        break;
    }
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
	<meta name="verify-v1" content="Kopl+oIQligBG3u/Bt7jhhxACPbdH82zTbDy4yXOow4=" />
	<title>Tall Eye - If I walk in a straight line around the world, where will I pass?</title>
	<!-- Titulo da pagina -->
	
	<!-- Declaracao de meta tags -->
	<meta http-equiv="content-type" content="text/html; charset=iso-8859-1" />
	<meta name="author" content="Luis Felipe Cipriani"/>
	<meta name="description" content="If I walk in a straight line around the world, where will I pass?"/>
	<meta name="keywords" content="[keywords]"/>
	
	<!-- Stylesheets para as midias screen e print -->
	<style type="text/css" media="screen">@import url("stylesheets/default.css");</style>
	<link rel="stylesheet" type="text/css" href="stylesheets/default.css" title="default" media="screen" />
	<!--<link rel="stylesheet" type="text/css" href="stylesheets/print.css" media="print" />
	<link rel="alternate stylesheet" type="text/css" href="stylesheets/alternate01.css" title="alternate01" media="screen" />-->
	
	<!-- Declaracao de scripts Javascript -->
	<script src="http://maps.google.com/maps?file=api&amp;v=2&amp;key=ABQIAAAA0uA357CkpYZ4NhE62ApMdRS5VQAtFbmZ9-2D15ntmOlW1theThQ6eLKLO-8KmWY5RFwvFe6wjQR2EQ" type="text/javascript"></script>
	
	<script type="text/javascript" src="scripts/prototype.js" ></script>
	<script type="text/javascript" src="scripts/scriptaculous.js"></script>
	<script type="text/javascript" src="scripts/helper.js"></script>
	<script type="text/javascript" src="scripts/earth.js"></script>
	<script type="text/javascript" src="scripts/compass.js"></script>
    <script type="text/javascript" src="scripts/control.js"></script>
	
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
		<img src="img/title.jpg" border="0" width="354" height="47" alt="If I walk in a straight line around the world, where will I pass?" />
	</h1>
</div> <!-- #header -->

<div id="menuBar">
	<a name="onLinking"></a>
	<div id="menuBarP1">&nbsp;</div>
	<div id="menuBarP2">&nbsp;</div>
	<p>
		<a href="index.php" title="Website home">home</a></a><span class="orange"> . </span>
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
		
			<?= $navLink ?>
			
			<br /><br >
			
			<a href="bighole.php" title="CWP">
				<img src="img/digNavTitle.gif" border="0" width="195" height="40" alt="CWPimg"/>
			</a>
			
		</p>
	</div> <!-- #navigation -->

	<div id="mainContent">
		<h2>Transform your daily workout in a big adventure!</h2>
		<p><br />
			Tired to walk on the same places everyday? Everytime you go walk, you don't know where to go? So... Walk in a straight line!<br /><br />
			It's very easy and you will never get lost, because you always will arrive in the start point after walk around the whole world. :-)<br /><br />
			
			<? if (strcmp($prKnd,"cwp") == 0) { ?>
			
			<b>How can we help you?</b> It's simple, just use our Google Maps Mashup to choose the place that you will start from and also the place that you want to pass by, and then, we show the path you will follow if you walk in a straight line around the world.<br /><br />
			However, if choosing where to pass isn't enough, starting from the same point, you may choose a direction in our <a href="index.php?knd=cyd" title="Go choose your direction">Choose your direction</a> mashup version.<br /><br />
			
			<? } else { ?>
			
			<b>How can we help you?</b> It's simple, just use our Google Maps Mashup to choose the place that you will start from and what direction you are going to walk, and then, we show where you gonna pass if you walk in a straight line around the world.<br /><br />
			However, if choosing a direction isn't enough, starting from the same point, you may choose where to pass in our <a href="index.php?knd=cwp" title="Go choose where to pass">Choose where to pass</a> mashup version.<br /><br />
			
			<? } ?>
			
			What you waiting for? In the map below we have a quick help that will teach you how to get your new directions... When you're done here, check out more cool Google Maps tools and mashups on <a href="http://googlemapsmania.blogspot.com/" target="_blank" title="Go to">Google Maps Mania</a>
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
		<iframe src="npIndex.php" name="iNear" id="iNearID"></iframe>
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
			<legend><b>Your Path as a Web Link</b></legend>
			With the link below, you can show to everyone the path that you will walk.<br />
			Select and copy the URL and then send by email, put on your webpage, click on it, do everything you want...
			<div id="exportLinkValue"><a href="#" id="exportLinkTest" target="_blank"><?=$linkToThis?></a></div>
		</fieldset>
	</div>
	
	
	<div id="nothing"></div>
	<p class="tinyText">Okay, if don't understand the soft humor of this website and still want to walk this huge distance, please remeber this: The path information may not be accurate or current and is not valid for navigation, walk, or flight planning. No warranty of fitness for any purpose is made or implied. Thank you for visiting us!</p>
	
</div> <!-- #content -->

<div id="footer">
	<div id="footerP1"></div>
	<div id="footerP2"></div>
	<span>&copy;2007  Tall Eye. All rights reserved.</span>
</div> <!-- #footer -->



<script type="text/javascript" src="http://www.statcounter.com/counter/counter_xhtml.js"></script><noscript><div class="statcounter"><a class="statcounter" href="http://www.statcounter.com/"><img class="statcounter" src="http://c25.statcounter.com/counter.php?sc_project=2530109&java=0&security=471909ee&invisible=0" alt="website metrics" /></a></div></noscript>
<!-- End of StatCounter Code -->
</body>

</html>