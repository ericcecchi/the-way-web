<?php

require "vendor/markdown.php";
// Enable for debugging
// ini_set('display_errors', 'On');
// error_reporting(E_ALL | E_STRICT);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
$domain = $_SERVER['HTTP_HOST'];
$prefix = $_SERVER['HTTPS'] ? 'https://' : 'http://';
$url = $prefix.$domain.'/theway/api/';
// Get cURL resource
if (array_key_exists("lang", $_GET)) {
	$url .= $_GET["lang"];
}
else {
	$url .= 'en';
}

if (array_key_exists("section", $_GET)) {
	$url .= '/'.$_GET["section"];
	$url .= '?sort=slug';
}
else {
	$url .= '?sort=slug&content=false';
}
// For testing
// $url .= '&ref=additional-content';

$curl = curl_init();
// Set some options - we are passing in a useragent too here
curl_setopt_array($curl, array(
	CURLOPT_RETURNTRANSFER => 1,
	CURLOPT_URL => $url,
));
// Send the request & save response to $resp
$resp = curl_exec($curl);
$json = json_decode($resp, TRUE);
if (array_key_exists("content", $json)) $json['content'] = Markdown($json['content']);
echo json_encode($json);
// Close request to clear up some resources
curl_close($curl);
