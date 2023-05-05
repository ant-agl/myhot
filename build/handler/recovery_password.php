<?php
require_once('vendor/autoload.php');
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
http_response_code(401);
$text = "Не стоит выполнять, нелегетимные запросы";
if(isset($_POST['code']) and isset($_POST['login']) and isset($_POST['hash_verify'] and isset($_POST['password'])){
	$code = trim($_POST['code']);
	$login = $_POST['hash_verify'];
	$hash = $_POST['hash'];
	$password = password_hash(trim($_POST['password']), PASSWORD_DEFAULT);
	if (strlen($code) == 4 && ctype_digit($code) && apcu_exists($login."_recovery_password_".$hash)) {
		$data = apcu_fetch($login."_recovery_password_".$hash);
		if ($code == $data['auth_code']) {
				$change_pass = time();
				$sql = "UPDATE users SET password = {$password}, change_pass = {$change_pass} WHERE id = ".$data['id']}
				$ch = curl_init();
				curl_setopt($ch, CURLOPT_URL, 'http://127.0.0.1:9088/api/v1/db/search/query?q='.rawurlencode($sql));
				curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
				curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
				$headers[] = 'Accept: application/json';
				curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
				$result = json_decode(curl_exec($ch),true);
				if (curl_errno($ch)) echo 'Error:' . curl_error($ch);
			http_response_code(200);
			echo "{'status':'ok'}";
		}
		else http_response_code(403);
	} 

}
else echo $text;


?>