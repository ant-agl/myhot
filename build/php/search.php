<?php 
http_response_code(400);
header('Content-Type: application/json');
$_GET['search'] = 'Тольятти';
$_GET['input_date'] = 1673211600;
$_GET['output_date'] = 1674507600;
/*$_GET['stars'] = true;
$_GET['services'] = true;
$_GET['str4'] = 4;
$_GET['input_date'] = 20230109;
$_GET['output_date'] = 20230124;
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
*/
if(isset($_GET['search']) and isset($_GET['input_date']) and isset($_GET['output_date']) and is_numeric($_GET['input_date']) and is_numeric($_GET['output_date'])){
	http_response_code(200);
	$search = addslashes(htmlspecialchars(strip_tags(trim($_GET['search']))));
	$sql = "SELECT * FROM `hotel_search` WHERE search = '$search~' ";
	if (isset($_GET['position']) and isset($_GET['position_long'])){
		if(is_numeric($_GET['position_long'])){
			switch ($_GET['position']) {
				case 'sea':
					$sql .= 'and (sea < '.$_GET['position_long'].' and not sea = 0) ';
					break;
				case 'center':
					$sql .= 'and (center < '.$_GET['position_long'].' and not center = 0) ';
					break;
				case 'metro':
					$sql .= 'and (metro < '.$_GET['position_long'].' and not metro = 0) ';
					break;
			}
		}
	}
	if (isset($_GET['stars'])){
		$stars = "";
		if (isset($_GET['str0']))	$stars .= 'or stars = 0 ';	
		if (isset($_GET['str1']))	$stars .= 'or stars = 1 ';
		if (isset($_GET['str2']))	$stars .= 'or stars = 2 ';
		if (isset($_GET['str3']))	$stars .= 'or stars = 3 ';
		if (isset($_GET['str4'])) 	$stars .= 'or stars = 4 ';
		if (isset($_GET['str5']))	$stars .= 'or stars = 5 ';
		if (strpos($stars,'or ') === 0) $stars = substr($stars,3);
		$sql .= "and ($stars) ";
	}
	if (isset($_GET['work'])){
		if ($_GET['work']){
			$sql .= 'and work = 1 ';
		}
		else{
			$sql .= 'and work = 0 ';
		}
	}
	if (isset($_GET['reviews'])){
		if(is_numeric($_GET['reviews'])){
			$sql .= 'and reviews >= '.$_GET['reviews'].' ';
		}
	}
	if (isset($_GET['services'])){
		$services = 'services allset (';
		$temp_services ="";
		if (isset($_GET['ser0']))	$temp_services .= ", 'wifi'";	
		if (isset($_GET['ser1']))	$temp_services .= ", 'transfer'";
		if (isset($_GET['ser2']))	$temp_services .= ", 'parking'";
		if (isset($_GET['ser3']))	$temp_services .= ", 'pool'";
		if (isset($_GET['ser4'])) 	$temp_services .= ", 'fitness'";
		if (isset($_GET['ser5']))	$temp_services .= ", 'catering'";
		if (isset($_GET['ser6']))	$temp_services .= ", 'hall'";
		if (isset($_GET['ser7']))	$temp_services .= ", 'spa'";
		if (isset($_GET['ser7']))	$temp_services .= ", 'ski'";
		if (isset($_GET['ser8']))	$temp_services .= ", 'beach'";
		if (isset($_GET['ser9']))	$temp_services .= ", 'jacuzzi'";
		if (strpos($temp_services,', ') === 0) $temp_services = substr($temp_services,2);
		$services .= "$temp_services) ";
		$sql .= "and $services";
	}
	if (isset($_GET['type'])){
		$type = "";
		if (isset($_GET['tp0']))	$type .= 'or type = 0 ';	
		if (isset($_GET['tp1']))	$type .= 'or type = 1 ';
		if (isset($_GET['tp2']))	$type .= 'or type = 2 ';
		if (isset($_GET['tp3']))	$type .= 'or type = 3 ';
		if (isset($_GET['tp4'])) 	$type .= 'or type = 4 ';
		if (isset($_GET['tp5']))	$type .= 'or type = 5 ';
		if (isset($_GET['tp6'])) 	$type .= 'or type = 6 ';
		if (isset($_GET['tp7']))	$type .= 'or type = 7 ';
		if (strpos($type,'or ') === 0) $type = substr($type,3);
		$sql .= "and ($type) ";
	}
	if (isset($_GET['pay'])){
		if ($_GET['pay']){
			$sql .= 'and pay = true ';
		}
		else{
			$sql .= 'and pay = false ';
		}
	}
	if (isset($_GET['undo'])){
		if ($_GET['undo']){
			$sql .= 'and undo = true ';
		}
		else{
			$sql .= 'and undo = false ';
		}
	}
	$sqls = "SELECT * FROM `reserve` WHERE not (input_date range({$_GET['input_date']},".($_GET['output_date']-1).") or output_date range (".($_GET['input_date']+1).",{$_GET['output_date']})) LEFT JOIN ($sql) ON reserve.id_hotel = hotel_search.id INNER JOIN (";
	$sqlr ='SELECT * FROM `rooms_search`';
	$sqlr_temp = "";
	if (isset($_GET['services_room']))	{
		$services = 'services allset (';
		$temp_services ="";
		if (isset($_GET['ser_r0']))	$temp_services .= ", 'conditioner'";
		if (isset($_GET['ser_r1']))	$temp_services .= ", 'bathroom'";
		if (isset($_GET['ser_r2']))	$temp_services .= ", 'window'";
		if (isset($_GET['ser_r3']))	$temp_services .= ", 'kitchen'";
		if (isset($_GET['ser_r4'])) $temp_services .= ", 'balcony'";
		if (isset($_GET['ser_r5']))	$temp_services .= ", 'tv'";
		if (strpos($temp_services,', ') === 0) $temp_services = substr($temp_services,2);
		$services .= "$temp_services) ";
		$sqlr_temp .= "and $services";
	}
	if (isset($_GET['beds']))	{
		$services = 'beds allset (';
		$temp_services ="";
		if (isset($_GET['b2']))	$temp_services .= ", 'double'";
		if (isset($_GET['b1']))	$temp_services .= ", 'singly'";
		if (strpos($temp_services,", ") === 0) $temp_services = substr($temp_services,2);
		$services .= "$temp_services) ";
		$sqlr_temp .= "and $services";
		 
	}
	if (isset($_GET['features']))	{
		$services = 'features allset (';
		$temp_services ="";
		if (isset($_GET['f1']))	$temp_services .= ", 'kids'";
		if (isset($_GET['f2']))	$temp_services .= ", 'smoke'";
		if (isset($_GET['f3']))	$temp_services .= ", 'animals'";
		if (isset($_GET['f4']))	$temp_services .= ", 'disabled'";
		if (strpos($temp_services,', ') === 0) $temp_services = substr($temp_services,2);
		$services .= "$temp_services) ";
		$sqlr_temp .= "and $services";
	}
	if (isset($_GET['feed']))	{
		$services = 'feed allset (';
		$temp_feed ="";
		if (isset($_GET['fd0']))	$temp_feed .= ', 0';	
		if (isset($_GET['fd1']))	$temp_feed .= ', 1';
		if (isset($_GET['fd2']))	$temp_feed .= ', 2';
		if (isset($_GET['fd3']))	$temp_feed .= ', 3';
		if (isset($_GET['fd4'])) 	$temp_feed .= ', 4';
		if (strpos($temp_feed,', ') === 0) $temp_feed = substr($temp_feed,2);
		$services = "$temp_feed) ";
		$sqlr_temp .= "and $services";
	}
	if (isset($_GET['persons'])){
		if(is_numeric($_GET['persons'])){
			$sqlr_temp .= 'and persons >= '.$_GET['persons'];
		}
	}
	if (strpos($sqlr_temp,'and ') === 0) $sqlr_temp = substr($sqlr_temp,4);
	if (strlen($sqlr_temp) !=0) $sqlr .= " WHERE $sqlr_temp";
	$sqls .= $sqlr.') ON reserve.id_room = rooms_search.id';
	$sql_prod = rawurlencode($sqls);
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, 'http://127.0.0.1:9088/api/v1/db/search/query?q='.$sql_prod);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
	$headers = array();
	$headers[] = 'Accept: application/json';
	curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
	$result = curl_exec($ch);
	if (curl_errno($ch)) {
	    echo 'Error:' . curl_error($ch);
	}
	echo $sqls;
	//$result=json_decode($result,true);
	//$result=json_encode($result['items'],JSON_UNESCAPED_UNICODE);
	echo $result;
	curl_close($ch);
}
?>