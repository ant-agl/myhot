<?php 
http_response_code(400);
header('Content-Type: application/json');
/*$_GET['input_date'] = 1673211600;
$_GET['output_date'] = 1674507600;
$_GET['search'] = 'Тольятти';
$_GET['stars'] = true;
$_GET['services'] = true;
$_GET['str4'] = 4;

$_GET['str5'] = 5;
$_GET['ser0'] = 0;
$_GET['work'] = 0;
$_GET['ser6'] = 6;
//$_GET['type'] = 3;
//$_GET['tp3'] = 1;
$_GET['position'] = 'sea';
$_GET['reviews'] = 6;
$_GET['price'] = 4000;
$_GET['position_long'] = 1400;
 SELECT * FROM hotel_search  WHERE search = '$search~' AND INNER JOIN (Select * from rooms_search )ON rooms_search.id_hotel = hotel_search.id 
AND NOT (INNER JOIN (select * from reserve WHERE (input_date range(1673211600,
1674680400) or output_date range(1673298000,
1674594000)) limit 0) ON hotel_search.id = reserve.id_hotel )
*/
if(isset($_GET['search']) and isset($_GET['input_date']) and isset($_GET['output_date']) and is_numeric($_GET['input_date']) and is_numeric($_GET['output_date'])){
	http_response_code(200);
	$search = addslashes(htmlspecialchars(strip_tags(trim($_GET['search']))));
	$sqlr ='SELECT * FROM `rooms_search`';
	$sqls = "SELECT * FROM `reserve` WHERE (input_date range({$_GET['input_date']},".($_GET['output_date']-1).") or output_date range (".($_GET['input_date']+1).",{$_GET['output_date']})";
	$sql = "SELECT * FROM `hotel_search` WHERE search = '$search~' AND INNER JOIN ($sqlr) ON rooms_search.id_hotel = hotel_search.id AND NOT (INNER JOIN ($sqls) limit 0) ON reserve.id_hotel =  hotel_search.id )  ORDER BY 'rank() + rating.popularity + id ' ASC";
	$sql_prod = rawurlencode($sql);
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, 'http://127.0.0.1:9088/api/v1/db/search/query?q='.$sql_prod);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
	$headers = array();
	$headers[] = 'Accept: application/json';
	curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
	$result = json_decode(curl_exec($ch),true);
	if (curl_errno($ch)) {
	    echo 'Error:' . curl_error($ch);
	}
    http_response_code(200);
    echo json_encode($result["items"]);
	curl_close($ch);
}
?>