<?php
http_response_code(403);
if (isset($_GET['id_hotel']) && is_numeric($_GET['id_hotel'])) {
	http_response_code(200);
	$idh = $_GET['id_hotel'];
	$sql = "SELECT `name`, `city`, `position.center`, `address`, `transport.metro.name`, `transport.metro.distance`, `transport.airport.name`, `transport.airport.distance`, `transport.train.name`, `transport.train.distance`, `rating.reviews`, `rating.stars`, `price` , 'description','image','images' FROM hotel_search WHERE id =".$idh;
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, 'http://127.0.0.1:9088/api/v1/db/search/query?q='.(rawurlencode($sql)));
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
	$headers[] = 'Accept: application/json';
	curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
	$result = json_decode(curl_exec($ch), true)['items'][0];
	//$result['rating'] = $result['rating']['reviews'];
	//$result['position'] = $result['position']['center'];
	if (curl_errno($ch)) echo 'Error:' . curl_error($ch);
	curl_close($ch);
	$sql2 = "SELECT `opinion.well` FROM reviews WHERE hotel_id = ".$idh." ORDER BY `id` DESC LIMIT 2 INNER JOIN (SELECT `id`, `img` FROM general) ON reviews.uid = general.uid INNER JOIN (SELECT `name`, `surname` FROM users) ON reviews.uid = users.id";
	$sql_prod = rawurlencode($sql2);
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, 'http://127.0.0.1:9088/api/v1/db/search/query?q='.$sql_prod);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
	$headers[] = 'Accept: application/json';
	curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
	$result2 = json_decode(curl_exec($ch), true)['items'];
	for ($i = 0; $i < count($result2); $i++) {
		$result2[$i]['name'] = $result2[$i]['joined_users'][0]['name'];
		$result2[$i]['surname'] = $result2[$i]['joined_users'][0]['surname'];
		$result2[$i]['review'] = $result2[$i]['opinion']['well'];
		if ($result2[$i]['joined_general'][0]['img']) {
			$result2[$i]['img_src'] = "https://wehotel.ru/img/user/".$result2[$i]['joined_general'][0]['id'].".webp";
		}
		unset($result2[$i]['joined_general'], $result2[$i]['joined_users'], $result2[$i]['opinion']);
	}
	if (curl_errno($ch)) echo 'Error:' . curl_error($ch);
	curl_close($ch);
	$result['reviews'] = $result2;
	echo json_encode($result, JSON_UNESCAPED_UNICODE);
}
?>