<?php
http_response_code(403);
$_GET['id_room'] = 1;
if (isset($_GET['id_room']) && is_numeric($_GET['id_room'])) {
    http_response_code(200);
	$idr = $_GET['id_room'];
	$sql = "SELECT `name`, `beds`, `features`, `services.free`, `services.paid`, `services.price`, `image`, `prices` FROM rooms_search WHERE id =".$idr;
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, 'http://127.0.0.1:9088/api/v1/db/search/query?q='.(rawurlencode($sql)));
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
	$headers[] = 'Accept: application/json';
	curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    $result = json_decode(curl_exec($ch), true)['items'][0];
    if (curl_errno($ch)) echo 'Error:' . curl_error($ch);
	curl_close($ch);
    echo json_encode($result, JSON_UNESCAPED_UNICODE);
}
?>