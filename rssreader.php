<?php
/*  PHP RSS Reader v1.1
    By Richard James Kendall 
    Bugs to richard@richardjameskendall.com 
    Free to use, please acknowledge me 
    
    Place the URL of an RSS feed in the $file variable.
   	
   	The $rss_channel array will be filled with data from the feed,
   	every RSS feed is different by by and large it should contain:
   	
   	Array {
   		[TITLE] = feed title
   		[DESCRIPTION] = feed description
   		[LINK] = link to their website
   		
   		[IMAGE] = Array {
   					[URL] = url of image
   					[DESCRIPTION] = alt text of image
   				}
   		
   		[ITEMS] = Array {
   					[0] = Array {
   							[TITLE] = item title
   							[DESCRIPTION] = item description
   							[LINK = a link to the story
   						}
   					.
   					.
   					.
   				}
   	}
   	
   	By default it retrives the Reuters Oddly Enough RSS feed. The data is put into the array
   	structure so you can format the information as you see fit.
*/
set_time_limit(0);

include 'include/npHTMLgen.php';

$latitude = $_GET["lat"];
$longitude = $_GET["lng"];
$raio = $_GET["raio"];

$rss_channel = array();
$currently_writing = "";
$main = "";
$item_counter = 0;

function startElement($parser, $name, $attrs) {
       global $rss_channel, $currently_writing, $main;
       switch($name) {
           case "RSS":
           case "RDF:RDF":
           case "ITEMS":
               $currently_writing = "";
               break;
           case "CHANNEL":
               $main = "CHANNEL";
               break;
           case "IMAGE":
               $main = "IMAGE";
               $rss_channel["IMAGE"] = array();
               break;
           case "ITEM":
               $main = "ITEMS";
               break;
           default:
               $currently_writing = $name;
               break;
       }
}

function endElement($parser, $name) {
       global $rss_channel, $currently_writing, $item_counter;
       $currently_writing = "";
       if ($name == "ITEM") {
           $item_counter++;
       }
}

function characterData($parser, $data) {
    global $rss_channel, $currently_writing, $main, $item_counter;
    if ($currently_writing != "") {
        switch($main) {
            case "CHANNEL":
                if (isset($rss_channel[$currently_writing])) {
                    $rss_channel[$currently_writing] .= $data;
                } else {
                    $rss_channel[$currently_writing] = $data;
                }
                break;
            case "IMAGE":
                if (isset($rss_channel[$main][$currently_writing])) {
                    $rss_channel[$main][$currently_writing] .= $data;
                } else {
                    $rss_channel[$main][$currently_writing] = $data;
                }
                break;
            case "ITEMS":
                if (isset($rss_channel[$main][$item_counter][$currently_writing])) {
                    $rss_channel[$main][$item_counter][$currently_writing] .= $data;
                } else {
                    //print ("rss_channel[$main][$item_counter][$currently_writing] = $data<br>");
                    $rss_channel[$main][$item_counter][$currently_writing] = $data;
                }
                break;
        }
    }
}

$xml_parser = xml_parser_create();
xml_set_element_handler($xml_parser, "startElement", "endElement");
xml_set_character_data_handler($xml_parser, "characterData");

$foundError = false;

$file = "http://geourl.org/near/?lat=".$latitude."&long=".$longitude."&dist=".$raio.";format=rss10"; 

$ch = curl_init();
$timeout = 5; // set to zero for no timeout
curl_setopt ($ch, CURLOPT_URL, $file);
curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt ($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
$file_contents = curl_exec($ch);
curl_close($ch);

//$oldErrorLevel = error_reporting(0);
if (preg_match("/Error 500/i", $file_contents)) {

	// inicio do XHTML
	$resultXML = getHeader();
	$resultXML .= getNoPoints();
	$resultXML .= getBottom();

} else {

	xml_parse($xml_parser, $file_contents);

	xml_parser_free($xml_parser);

	$resultXML = getHeader();
	
	if (!$foundError) {
		
		$resultXML = getHeader();
		
		$resultXML .= getTop(count($rss_channel["ITEMS"]),$raio);
		
		$resultXML .= getAdsense("120X240");
		
		if (isset($rss_channel["ITEMS"])) {
			
		    if (count($rss_channel["ITEMS"]) > 0) {
		        for($i = 0;$i < count($rss_channel["ITEMS"]);$i++) {
				
					$resultXML .= generateNPHTML($i, 
						$rss_channel["ITEMS"][$i]["GEOURL:LATITUDE"], 
						$rss_channel["ITEMS"][$i]["GEOURL:LONGITUDE"], 
						$rss_channel["ITEMS"][$i]["LINK"], 
						$rss_channel["ITEMS"][$i]["TITLE"], 
						html_entity_decode($rss_channel["ITEMS"][$i]["DESCRIPTION"]), 
						substr(html_entity_decode($rss_channel["ITEMS"][$i]["DESCRIPTION"]), strpos(html_entity_decode($rss_channel["ITEMS"][$i]["DESCRIPTION"]), "Near")+5, strlen(html_entity_decode($rss_channel["ITEMS"][$i]["DESCRIPTION"]))-(strpos(html_entity_decode($rss_channel["ITEMS"][$i]["DESCRIPTION"]), "Near")+6) ), 
						substr(html_entity_decode($rss_channel["ITEMS"][$i]["DESCRIPTION"]), 6, strpos(html_entity_decode($rss_channel["ITEMS"][$i]["DESCRIPTION"]), "km")-6 ) ." km");
		        }
		    } 
		}
		$resultXML .= getBottom();
	}
}

//error_reporting($oldErrorLevel);
print $resultXML;
?>