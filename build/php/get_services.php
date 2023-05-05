<?php
http_response_code(403);
if (isset($_GET['id_hotel']) && is_numeric($_GET['id_hotel'])) {
	http_response_code(200);
	$idh = $_GET['id_hotel'];
	$sql = "SELECT `services` FROM hotel_search WHERE id =".$idh;
	$sql_prod = rawurlencode($sql);
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, 'http://127.0.0.1:9088/api/v1/db/search/query?q='.$sql_prod);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
	$headers[] = 'Accept: application/json';
	curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
	$result = json_decode(curl_exec($ch), true)['items'][0]['services'];
	if (curl_errno($ch)) echo 'Error:' . curl_error($ch);
	curl_close($ch);
	echo json_encode($result, JSON_UNESCAPED_UNICODE);
}
?>