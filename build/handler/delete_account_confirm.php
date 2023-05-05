<?php
require_once('vendor/autoload.php');
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
// http_response_code(403);
require_once('help_auth.php');
$_SERVER['HTTP_AUTHORIZATION'] = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJodHRwczovL3dlaG90ZWwucnUiLCJzdWIiOiJ1c2VycyIsImF1ZCI6MiwianRpIjozMzI2MjMzMSwidXNkIjoie1wibmFtZVwiOlwiXFx1MDQxOFxcdTA0MzIyXFx1MDQzMFxcdTA0M2RcIixcInBhdHJvbnltaWNcIjpcIlxcdTA0MThcXHUwNDMyXFx1MDQzMFxcdTA0M2QyXFx1MDQzZVxcdTA0MzJcXHUwNDM4XFx1MDQ0N1wiLFwic3VybmFtZVwiOlwiXFx1MDQxOFxcdTA0MzJcXHUwNDMwXFx1MDQzZFxcdTA0M2VcXHUwNDMyMlwiLFwiaWRcIjoxLFwibG9naW5cIjpcImxvZ2luMlwiLFwiZGZhXCI6Mn0iLCJpYXQiOiIxNjgxMTQ1NTY2IiwibmJmIjoxNjgxMTQ1NTY3LCJleHAiOjE2OTE1MTM1Njd9.3y7aS7pPt75HmjLS3MtSVzm5YtBMRPgAGyZb3dRTIgS5oQgknRYSFjn28n_gR4w2msX3gho_rJpYCeYcHReehw";
$user_auth_data = auth_data();
// $_POST['code'] = 8338;
if (isset($_POST['code'])) {
	$code = $_POST['code'];
	if ($user_auth_data) {
		$login = json_decode(json_decode($user_auth_data) -> usd) -> login;
		$id = json_decode($user_auth_data) -> aud;
		$jti = json_decode($user_auth_data) -> jti;
		if (strlen($code) == 4 && ctype_digit((string)$code) && apcu_exists($login."-".$jti)) {
			$data = apcu_fetch($login."-".$jti);
			if ($code == $data['auth_code'] && GetIP() == $data['ip']) {
				http_response_code(200);
				$sql = "DELETE FROM users WHERE id = ".$id;
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
		    curl_close($ch);
		    // print_r($result);
				$sql = "DELETE FROM general WHERE uid = ".$id;
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
		    curl_close($ch);
		    $sql = "DELETE FROM favourites WHERE uid = ".$id;
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
		    curl_close($ch);
			}
		}
	}
}
function GetIP() {
  if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
    $ip = $_SERVER['HTTP_CLIENT_IP'];
  } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
    $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
  } else {
    $ip = $_SERVER['REMOTE_ADDR'];
  }
  return $ip;
}
?>