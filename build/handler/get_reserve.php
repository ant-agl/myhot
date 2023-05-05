<?php
require_once('vendor/autoload.php');
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
http_response_code(403);
/*$_SERVER['HTTP_AUTHORIZATION'] = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJodHRwczovL3dlaG90ZWwucnUiLCJzdWIiOiJ1c2VycyIsImF1ZCI6NDQsImp0aSI6NzgwNTQyOTEsInVzZCI6IntcImlkXCI6MjMsXCJsb2dpblwiOjc5NzgwMzQ2Mzc1LFwic3VybmFtZVwiOlwiXFx1MDQxOFxcdTA0MzJcXHUwNDMwXFx1MDQzZFxcdTA0M2VcXHUwNDMyXCIsXCJuYW1lXCI6XCJcXHUwNDE4XFx1MDQzMlxcdTA0MzBcXHUwNDNkXCIsXCJwYXRyb255bWljXCI6XCJcXHUwNDE4XFx1MDQzMlxcdTA0MzBcXHUwNDNkXFx1MDQzZVxcdTA0MzJcXHUwNDM4XFx1MDQ0NzEyXCIsXCIyZmFcIjowfSIsImlhdCI6IjE2ODIzNTQ1NTIiLCJuYmYiOjE2ODIzNTQ1NTMsImV4cCI6MTY5MjcyMjU1M30.QWUsgaEFv-y_6jvIkhAE5xfyvm09L80Hfswd6RcnnC72QU7_cHa0QbGArjGXPKgD6wp5JOnFkntv--2IBI6tBQ";*/
require_once('help_auth.php');
$user_auth_data = auth_data();
if ($user_auth_data) {
	http_response_code(200);
	$id = json_decode($user_auth_data) -> aud;
    $sql = "SELECT `input_date`, `output_date`, `status`, `number_of_adults`, `count_of_kids`, `cost_per_night`, `cost_full`, `id_room` FROM reserve INNER JOIN (SELECT `name`, `city`, `country`, `image` FROM hotel_search) ON reserve.id_hotel = hotel_search.id INNER JOIN (SELECT `name` FROM rooms_search) ON reserve.id_room = rooms_search.id WHERE uid = ".$id;
	$sql_prod = rawurlencode($sql);
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, 'http://127.0.0.1:9088/api/v1/db/search/query?q='.$sql_prod);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
	$headers = array();
	$headers[] = 'Accept: application/json';
	curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
	$result = json_decode(curl_exec($ch), true)['items'];
	if (curl_errno($ch)) {
		echo 'Error:' . curl_error($ch);
	}
	curl_close($ch);
    echo json_encode($result, JSON_UNESCAPED_UNICODE);
}
?>