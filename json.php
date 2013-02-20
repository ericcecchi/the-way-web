<?php

header('Content-Type: application/json');

$url = 'https://api.github.com/repos/ericcecchi/goldenripe-translations/contents/';
// Get cURL resource
if ($_GET["lang"]) {
	$url .= $_GET["lang"];
}
else {
	$url .= 'en';
}

if ($_GET["section"]) {
	$url .= '/'.$_GET["section"];
}

$url .= '?client_id=f3f313d272e7e8685ddb&client_secret=475285a6586698b53dd44da412192c58995bb1ae';
// For testing
// $url .= '&ref=additional-content';

$curl = curl_init();
// Set some options - we are passing in a useragent too here
curl_setopt_array($curl, array(
	CURLOPT_RETURNTRANSFER => 1,
	CURLOPT_URL => $url,
));
// Send the request & save response to $resp
echo curl_exec($curl);
// Close request to clear up some resources
curl_close($curl);
