<?php
require_once('vendor/autoload.php');
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
http_response_code(403);
/*$_POST['code'] = 7937;
$_POST['phone'] = 79780346375;
$_POST['hash_verify'] = "069314198073b6a7890a427200dd55d07f92ec583787828449bdc1940400faa2bf25e3e54cba279dc96d616a0631f9cf5ef03d029723a28eead2cfcc139513e0";*/
if (isset($_POST['code']) and isset($_POST['phone']) and isset($_POST['hash_verify'])) {
	$code = trim($_POST['code']);
	$login = $_POST['phone'];
	$hash = $_POST['hash_verify'];
	if (strlen($code) == 4 && ctype_digit($code) && apcu_exists($login."_-_".$hash)) {
		$data = apcu_fetch($login."_-_".$hash);
		if ($code == $data['auth_code']) {
			// print_r($data);
			$hash_ver = hash('sha3-512', $login.$data['salt']);
			//удалить все данные по прошлому хэшу, и сохранить новые данные
			if (($hash_ver === $hash) and (GetIP() == $data['ip'])){
				http_response_code(200);
				$ttl = 1200;
				$salt = bin2hex(random_bytes(256));
				$hash_ver2 = hash('sha3-512', $login.$salt);
				$loss = [
					"login" => $login,
					"hash_verify2" => $hash_ver2
				];
				$isStored = apcu_store($login."_-_".$hash_ver2, ["salt" => $salt, "ip" => GetIP()], $ttl);
				echo json_encode($loss);
				// $redis = new Redis();
				// $redis->connect('localhost', 6379);
				// $redis->auth(' ');
				// if (!($redis->ping())) {
				// 	echo "Redis error";
				// }
				// $redis->select(2);
				// $value = $redis->rawCommand('GET', $login."_-_".$hash);
				// if ($value){
				// 	$result = json_decode($value,true);
				// 	$result['id'] = 0;
				// 	$str = json_encode($result); 
				//     $ch = curl_init();
				//     curl_setopt($ch, CURLOPT_URL, 'http://127.0.0.1:9088/api/v1/db/search/namespaces/users/items?format=json');
				//     curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
				//     curl_setopt($ch, CURLOPT_POSTFIELDS, $str);
				//     curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
				//     $headers = array();
				//     $headers[] = 'Accept: application/json';
				//     curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
				//     $result = curl_exec($ch);
				//     if (curl_errno($ch)) {
				//         echo 'Error:' . curl_error($ch);
				//     }
				//     curl_close($ch);
				// }

			}
			// $redis = new Redis();
			// $redis->connect('localhost', 6379);
			// $redis->auth(' ');
			// if (!($redis->ping())) {
			// 	echo "Redis error";
			// }
			// $redis->select(2);
			// $len = $redis->lLen($login);
			// if ($len > 5) {
			// 	$redis->lRem($login, $redis->lindex($login, 0), 1);
			// }
			// $jti_new = rand(10000000,99999999);
			// $res = $redis->lInsert($login, Redis::AFTER, $jti_new, $jti_new);
			// if ($res == 0 || $res == -1) {
			// 	$redis->rPush($login, $jti_new);
			// } else {
			// 	$n = 0;
			// 	$redis->lRem($login, $jti_new, 1);
			// 	while (($re = $redis->lInsert($login, Redis::AFTER, $r1 = rand(10000000,99999999), $r1)) != -1 && $n < 10) {
			// 		$redis->lRem($login, $r1, 1);
			// 	}
			// 	$redis->rPush($login, $r1);
			// }
			// $data2['login'] = $login;
			// $data2['dfa'] = $data['dfa'];
			// // $sub = $data['role'];
			// $sub = "users";
			// $aud = $data2['id'];
			// $data2['id'] = $data['id'];
			// require_once('core.php');
			// $payload = ['iss' => $iss,
			//  'sub' => $sub,
			//  'aud' => $aud,
			//  'jti' => $jti,
			//  'usd' => $usd,
			//  'iat' => $iat,
			//  'nbf' => $nbf,
			//  'exp' => $exp
			// ];
			// $data2['token'] = JWT::encode($payload, $key, 'HS512');
			// // setcookie("token", $data['token'], time() + 86400);
			// http_response_code(200);
			// echo json_encode($data2, JSON_UNESCAPED_UNICODE);
		}
		
	} 
	//проверки входных данных.
	//сравнить ip; сравнить id = с id из кэша. hash использовать как ключ
	//каждое поле,проверка на инъекцию или js.
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