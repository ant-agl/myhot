<?php
http_response_code(403);
if (isset($_GET['id_hotel']) && is_numeric($_GET['id_hotel'])) {
	http_response_code(200);
	$idh = $_GET['id_hotel'];
	$sql = 'SELECT Avg(rating), Avg(cleanliness), Avg(staff), Avg(location), Avg(conveniences), Avg(comfort), Avg(ratio) FROM reviews WHERE hotel_id = '.$idh;
	$sql_prod = rawurlencode($sql);
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, 'http://127.0.0.1:9088/api/v1/db/search/query?q='.$sql_prod);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
	$headers[] = 'Accept: application/json';
	curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
	$result = json_decode(curl_exec($ch), true)['aggregations'];
	if (curl_errno($ch)) echo 'Error:' . curl_error($ch);
	curl_close($ch);
	$ar = [];
	for ($i = 0; $i < count($result); $i++) $ar[$result[$i]['fields'][0]] = $result[$i]['value'];
	echo json_encode($ar, JSON_UNESCAPED_UNICODE);
}
?>