<?php
require_once('vendor/autoload.php');
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
http_response_code(403);
/*$_SERVER['HTTP_AUTHORIZATION'] = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJodHRwczovL3dlaG90ZWwucnUiLCJzdWIiOiJ1c2VycyIsImF1ZCI6MiwianRpIjozMzI2MjMzMSwidXNkIjoie1wibmFtZVwiOlwiXFx1MDQxOFxcdTA0MzIyXFx1MDQzMFxcdTA0M2RcIixcInBhdHJvbnltaWNcIjpcIlxcdTA0MThcXHUwNDMyXFx1MDQzMFxcdTA0M2QyXFx1MDQzZVxcdTA0MzJcXHUwNDM4XFx1MDQ0N1wiLFwic3VybmFtZVwiOlwiXFx1MDQxOFxcdTA0MzJcXHUwNDMwXFx1MDQzZFxcdTA0M2VcXHUwNDMyMlwiLFwiaWRcIjoxLFwibG9naW5cIjpcImxvZ2luMlwiLFwiZGZhXCI6Mn0iLCJpYXQiOiIxNjgxMTQ1NTY2IiwibmJmIjoxNjgxMTQ1NTY3LCJleHAiOjE2OTE1MTM1Njd9.3y7aS7pPt75HmjLS3MtSVzm5YtBMRPgAGyZb3dRTIgS5oQgknRYSFjn28n_gR4w2msX3gho_rJpYCeYcHReehw";*/
require_once('help_auth.php');
$user_auth_data = auth_data();
if ($user_auth_data) {
	http_response_code(200);
	$gid = json_decode(json_decode($user_auth_data) -> usd) -> id;
	$id = json_decode($user_auth_data) -> aud;
	$sql = "SELECT `change_pass`, `2fa`, `img`, `email_confirm` FROM general WHERE id = ".$gid;
	$sql_prod = rawurlencode($sql);
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, 'http://127.0.0.1:9088/api/v1/db/search/query?q='.$sql_prod);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
	$headers = array();
	$headers[] = 'Accept: application/json';
	curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
	$result = json_decode(curl_exec($ch), true)['items'][0];
	if (curl_errno($ch)) {
		echo 'Error:' . curl_error($ch);
	}
	curl_close($ch);
	switch ($result['2fa']) {
		case 0:
			$result['2fa'] = 'no';
			break;
		case 1:
			$result['2fa'] = 'mail';
			break;
		case 2:
			$result['2fa'] = 'phone';
			break;
		case 3:
			$result['2fa'] = 'app';
			break;
	}
	if ($result['img']) {
		$result['img_id'] = "https://wehotel.ru/img/user/".$gid.".webp";
	}
	unset($result['img']);
	$sql2 = "SELECT `birthday`, `name`, `patronymic`, `surname`, `email`, `phone` FROM users WHERE id = ".$id;
	$sql_prod = rawurlencode($sql2);
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, 'http://127.0.0.1:9088/api/v1/db/search/query?q='.$sql_prod);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
	$headers = array();
	$headers[] = 'Accept: application/json';
	curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
	$result2 = json_decode(curl_exec($ch), true)['items'][0];
	// print_r($result);
	if (curl_errno($ch)) {
		echo 'Error:' . curl_error($ch);
	}
	curl_close($ch);
	echo json_encode(array_merge($result, $result2), JSON_UNESCAPED_UNICODE);
}
?>