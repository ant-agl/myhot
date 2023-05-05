<?php
require_once('vendor/autoload.php');
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
http_response_code(401);
$text = "Не стоит выполнять, нелегетимные запросы";
if(isset($_POST['code']) and isset($_POST['login']) and isset($_POST['hash'])){
	$code = trim($_POST['code']);
	$login = $_POST['login'];
	$hash = $_POST['hash'];
	if (strlen($code) == 4 && ctype_digit($code) && apcu_exists($login."_recovery_".$hash)) {
		$data = apcu_fetch($login."_recovery_".$hash);
		if ($code == $data['auth_code'] AND $data['ip'] == GetIP() AND $data['active']) {
				$salt_key = bin2hex(random_bytes(256));
				$hash_ver = hash('sha3-512', $hash.$salt_key);
				$auth_code = rand(10000000,99999999);
				$ttl = 60;
				$isStored = apcu_store($login."_recovery_password_".$hash_ver, ['auth_code' => $auth_code,  "id" => $data["id"], $ttl);
				$loss = [
					"hash_verify" => $hash_ver,
					"code" => $auth_code 
				];
			http_response_code(200);
			echo json_encode($loss, JSON_UNESCAPED_UNICODE);
		}
		else http_response_code(403);
	} 

}
else echo $text;
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