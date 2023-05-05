<?php
require_once('vendor/autoload.php');
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
// http_response_code(403);
$_SERVER['HTTP_AUTHORIZATION'] = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJodHRwczovL3dlaG90ZWwucnUiLCJzdWIiOiJ1c2VycyIsImF1ZCI6NDQsImp0aSI6NzgwNTQyOTEsInVzZCI6IntcImlkXCI6MjMsXCJsb2dpblwiOjc5NzgwMzQ2Mzc1LFwic3VybmFtZVwiOlwiXFx1MDQxOFxcdTA0MzJcXHUwNDMwXFx1MDQzZFxcdTA0M2VcXHUwNDMyXCIsXCJuYW1lXCI6XCJcXHUwNDE4XFx1MDQzMlxcdTA0MzBcXHUwNDNkXCIsXCJwYXRyb255bWljXCI6XCJcXHUwNDE4XFx1MDQzMlxcdTA0MzBcXHUwNDNkXFx1MDQzZVxcdTA0MzJcXHUwNDM4XFx1MDQ0NzEyXCIsXCIyZmFcIjowfSIsImlhdCI6IjE2ODIzNTQ1NTIiLCJuYmYiOjE2ODIzNTQ1NTMsImV4cCI6MTY5MjcyMjU1M30.QWUsgaEFv-y_6jvIkhAE5xfyvm09L80Hfswd6RcnnC72QU7_cHa0QbGArjGXPKgD6wp5JOnFkntv--2IBI6tBQ";

// $_POST['surname'] = 'Иванов';
// $_POST['name'] = 'Иван';
// $_POST['patronymic'] = 'Иванович';
// $_POST['number'] = 79728763827;
// $_POST['email'] = 'mr.dany2003@mail.ru';
$_POST['adults'] = 2;
$_POST['children'] = 1;
$_POST['input_date'] = 1676890800;
$_POST['output_date'] = 1677322800;
$_POST['paid'] = [1, 2, 4];
$_POST['price'] = [1000, 2000, 4000];
$_POST['night'] = 22600;
// $_POST['wishes'] = "хочу арбуз";
$_POST['id_hotel'] = 0;
$_POST['id_room'] = 1;


if (isset($_POST['surname']) and isset($_POST['name']) and isset($_POST['number']) and isset($_POST['email']) and isset($_POST['adults']) and isset($_POST['children']) and isset($_POST['input_date']) and isset($_POST['output_date']) and isset($_POST['night'])) {
	require_once('help_auth.php');
	$user_auth_data = auth_data();
	if ($user_auth_data) {
		$uid = json_decode($user_auth_data) -> aud;
		$arr = [];
		$id_hotel = $_POST['id_hotel'];
		$arr['id_hotel'] = $id_hotel;
		$id_room = $_POST['id_room'];
		$arr['id_room'] = $id_room;
		$surname = $_POST['surname'];
		$name = $_POST['name'];
		$number = $_POST['number'];
		$email = $_POST['email'];
		$arr['user'] = array('surname' => $surname, 'name' => $name, 'number' => $number, 'email' => $email, 'email' => $email);
		if (isset($_POST['patronymic'])) {
			$patronymic = $_POST['patronymic'];
			$arr['user']['patronymic'] = $patronymic;
		}
		$adults = $_POST['adults'];
		$children = $_POST['children'];
		$arr['number'] = array('adults' => $adults, 'children' => $children, 'people' => $adults + $children);
		$input_date = $_POST['input_date'];
		$arr['input_date'] = $input_date;
		$output_date = $_POST['output_date'];
		$arr['output_date'] = $output_date;
		if (isset($_POST['paid']) and isset($_POST['price'])) {
			$paid = $_POST['paid'];
			$price = $_POST['price'];
			$arr['services'] = array('paid' => $paid, 'price' => $price);
		}
		if (isset($_POST['wishes'])) {
			$wishes = $_POST['wishes'];
			$arr['wishes'] = $wishes;
		}
		$arr['status'] = 5;
		$night = $_POST['night'];
		$arr['night'] = $night;
		if (intdiv($output_date - $input_date, 86400) === (($output_date - $input_date) / 86400)) {
			$dif = (($output_date - $input_date) / 86400) - 1;
		} else {
			$dif = intdiv($output_date - $input_date, 86400);
		}
		$full = $night * ($dif + 1);
		$arr['full'] = $full;
		$arr['id'] = 0;
		$str = json_encode($arr); 
	    $ch = curl_init();
	    curl_setopt($ch, CURLOPT_URL, 'http://127.0.0.1:9088/api/v1/db/search/namespaces/reserve/items?format=json&precepts=id=serial()');
	    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	    curl_setopt($ch, CURLOPT_POSTFIELDS, $str);
	    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
	    $headers = array();
	    $headers[] = 'Accept: application/json';
	    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
	    $result = curl_exec($ch);
	    // echo $result;
	    if ($result['success']) {
			http_response_code(200);
	    }
	    if (curl_errno($ch)) {
	        echo 'Error:' . curl_error($ch);
	    }
	    curl_close($ch);
		// echo json_encode($arr, JSON_UNESCAPED_UNICODE);
	}
}
// require_once('help_auth.php');
// $user_auth_data = auth_data();
// if ($user_auth_data) {
	// http_response_code(200);
	// $gid = json_decode(json_decode($user_auth_data) -> usd) -> id;
	// $id = json_decode($user_auth_data) -> aud;
	// $sql = "SELECT `change_pass`, `2fa`, `img`, `email_confirm` FROM general WHERE id = ".$gid;
	// $sql_prod = rawurlencode($sql);
	// $ch = curl_init();
	// curl_setopt($ch, CURLOPT_URL, 'http://127.0.0.1:9088/api/v1/db/search/query?q='.$sql_prod);
	// curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	// curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
	// $headers = array();
	// $headers[] = 'Accept: application/json';
	// curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
	// $result = json_decode(curl_exec($ch), true)['items'][0];
	// if (curl_errno($ch)) {
	// 	echo 'Error:' . curl_error($ch);
	// }
	// curl_close($ch);
	// switch ($result['2fa']) {
	// 	case 0:
	// 		$result['2fa'] = 'no';
	// 		break;
	// 	case 1:
	// 		$result['2fa'] = 'mail';
	// 		break;
	// 	case 2:
	// 		$result['2fa'] = 'phone';
	// 		break;
	// 	case 3:
	// 		$result['2fa'] = 'app';
	// 		break;
	// }
	// if ($result['img']) {
	// 	$result['img_id'] = "https://wehotel.ru/img/user/".$gid.".webp";
	// }
	// unset($result['img']);
	// $sql2 = "SELECT `birthday`, `name`, `patronymic`, `surname`, `email`, `phone` FROM users WHERE id = ".$id;
	// $sql_prod = rawurlencode($sql2);
	// $ch = curl_init();
	// curl_setopt($ch, CURLOPT_URL, 'http://127.0.0.1:9088/api/v1/db/search/query?q='.$sql_prod);
	// curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	// curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
	// $headers = array();
	// $headers[] = 'Accept: application/json';
	// curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
	// $result2 = json_decode(curl_exec($ch), true)['items'][0];
	// // print_r($result);
	// if (curl_errno($ch)) {
	// 	echo 'Error:' . curl_error($ch);
	// }
	// curl_close($ch);
	// echo json_encode(array_merge($result, $result2), JSON_UNESCAPED_UNICODE);
?>