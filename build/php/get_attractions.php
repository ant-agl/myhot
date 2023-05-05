<?php
http_response_code(403);
if (isset($_GET['id_hotel']) && is_numeric($_GET['id_hotel'])) {
	http_response_code(200);
	$idh = $_GET['id_hotel'];
	$sql = "SELECT `position.coordinate` FROM hotel_search WHERE id =".$idh;
	$ch = prod($sql);
	$coords1 = json_decode(curl_exec($ch), true)['items'][0]['position']['coordinate'];
	if (curl_errno($ch)) echo 'Error:' . curl_error($ch);
	curl_close($ch);
	$sql = "SELECT `name`, `coordinate` FROM attractions WHERE ST_DWithin(`coordinate`, ST_GeomFromText('point(".implode(' ', $coords1).")'), 0.7553792)";
	$ch = prod($sql);
	$result2 = json_decode(curl_exec($ch), true)['items'];
	if (curl_errno($ch)) echo 'Error:' . curl_error($ch);
	curl_close($ch);
	
	$sql = "SELECT `name`, `coordinate` FROM airport WHERE ST_DWithin(`coordinate`, ST_GeomFromText('point(".implode(' ', $coords1).")'), 0.7553792)";
	$ch = prod($sql);
	$result3 = json_decode(curl_exec($ch), true)['items'];
	if (curl_errno($ch)) echo 'Error:' . curl_error($ch);
	curl_close($ch);
	
	$sql = "SELECT `name`, `coordinate` FROM metro WHERE ST_DWithin(`coordinate`, ST_GeomFromText('point(".implode(' ', $coords1).")'), 0.7553792)";
	$ch = prod($sql);
	$result4 = json_decode(curl_exec($ch), true)['items'];
	if (curl_errno($ch)) echo 'Error:' . curl_error($ch);
	curl_close($ch);
	
	echo json_encode(['Достопримечательности' => cycle($coords1, $result2), 'Аэропорт' => cycle($coords1, $result3), 'Метро' => cycle($coords1, $result4)], JSON_UNESCAPED_UNICODE);
}
function calculateTheDistance($φA, $λA, $φB, $λB) {
	// перевести координаты в радианы
	$lat1 = $φA * M_PI / 180;
	$lat2 = $φB * M_PI / 180;
	$long1 = $λA * M_PI / 180;
	$long2 = $λB * M_PI / 180;
	// косинусы и синусы широт и разницы долгот
	$cl1 = cos($lat1);
	$cl2 = cos($lat2);
	$sl1 = sin($lat1);
	$sl2 = sin($lat2);
	$delta = $long2 - $long1;
	$cdelta = cos($delta);
	$sdelta = sin($delta);
	// вычисления длины большого круга
	$y = sqrt(($cl2 * $sdelta) ** 2 + ($cl1 * $sl2 - $sl1 * $cl2 * $cdelta) ** 2);
	$x = $sl1 * $sl2 + $cl1 * $cl2 * $cdelta;
	//
	$ad = atan2($y, $x);
	$dist = $ad * 6372795;
	return $dist / 1000;
}
function haversineGreatCircleDistance($latitudeFrom, $longitudeFrom, $latitudeTo, $longitudeTo, $earthRadius = 6372.795) {
  $latFrom = deg2rad($latitudeFrom);
  $lonFrom = deg2rad($longitudeFrom);
  $latTo = deg2rad($latitudeTo);
  $lonTo = deg2rad($longitudeTo);
  $latDelta = $latTo - $latFrom;
  $lonDelta = $lonTo - $lonFrom;
  $angle = 2 * asin(sqrt((sin($latDelta / 2) ** 2) + cos($latFrom) * cos($latTo) * (sin($lonDelta / 2)** 2)));
  return $angle * $earthRadius ;
}
function prod($sql) {
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, 'http://127.0.0.1:9088/api/v1/db/search/query?q='.(rawurlencode($sql)));
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
	$headers[] = 'Accept: application/json';
	curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
	return $ch;
}//переписать на curl_multi/ запросы не зависимые, значит можно сделать параллельно 

function cycle($coords1, $result) {
	for ($i = 0; $i < count($result); $i++) { 
		$result[$i]['distance'] = haversineGreatCircleDistance($coords1[0], $coords1[1], $result[$i]['coordinate'][0], $result[$i]['coordinate'][1]);
		unset($result[$i]['coordinate']);
	}
	return $result;
}

?>