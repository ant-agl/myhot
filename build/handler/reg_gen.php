<?php
require_once('vendor/autoload.php');
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
http_response_code(403);
/*$_POST['password'] = "password";
$_POST['login'] = 79780346375;
$_POST['hash_verify'] = "55419b0255ef5fef3b72436bb058b3946919be8e69e778da4af37cad108a51ae4da1d274c7bc99f9e8af90252bc41bae0367c1865fa08c1c94956857804f94e6";
$_POST['hash_verify2'] = "069314198073b6a7890a427200dd55d07f92ec583787828449bdc1940400faa2bf25e3e54cba279dc96d616a0631f9cf5ef03d029723a28eead2cfcc139513e0";
// досрочно снять можно только через тех поддержку. или смену пароля. соотвественно нужен счётчик и поле блокировки.*/
if(isset($_POST['password']) and isset($_POST['login']) and isset($_POST['hash_verify']) and isset($_POST['hash_verify2'])){
	$password = trim($_POST['password']);
	$login = $_POST['login'];
	$hash = $_POST['hash_verify'];
	$hash2 = $_POST['hash_verify2'];
	if (apcu_exists($login."_-_".$hash)) {
		$data = apcu_fetch($login."_-_".$hash);
		$hash_ver = hash('sha3-512', $login.$data['salt']);
		//удалить все данные по прошлому хэшу, и сохранить новые данные
		if (($hash_ver === $hash) and (GetIP() == $data['ip'])){
			$redis = new Redis();
			$redis->connect('localhost', 6379);
			$redis->auth(' ');
			if (!($redis->ping())) {
				echo "Redis error";
			}
			$redis->select(2);
			$value = $redis->rawCommand('GET', $login."_-_".$hash);
			if ($value){
				$result3 = json_decode($value, true);
				$result3['phone'] = (int)$result3['phone'];
				$result3['password'] = password_hash($password, PASSWORD_DEFAULT);
				$result3['id'] = 0;
				$result3['balance'] = 0;
				$str = json_encode($result3, JSON_UNESCAPED_UNICODE); 
			    $ch = curl_init();
			    curl_setopt($ch, CURLOPT_URL, 'http://127.0.0.1:9088/api/v1/db/search/namespaces/users/items?format=json&precepts=id=serial()');
			    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
			    curl_setopt($ch, CURLOPT_POSTFIELDS, $str);
			    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
			    $headers = array();
			    $headers[] = 'Accept: application/json';
			    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
			    $result = json_decode(curl_exec($ch), true);
			    if (curl_errno($ch)) {
			        echo 'Error:' . curl_error($ch);
			    }
			    curl_close($ch);
			    // print_r($result);
			    if ($result['success']) {
			    	$str = json_encode(array('id' => 0,'uid' => $result['items'][0]['id'], 'sub' => 'users', 'active_status' => true, 'email_confirm' => false, 'last_visit' => time(), 'reg_date' => time(), 'change_pass' => time(), 'last_ip' => GetIP(), '2fa' => 0, 'img' => false)); 
				    $ch = curl_init();
				    curl_setopt($ch, CURLOPT_URL, 'http://127.0.0.1:9088/api/v1/db/search/namespaces/general/items?format=json&precepts=id=serial()');
				    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
				    curl_setopt($ch, CURLOPT_POSTFIELDS, $str);
				    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
				    $headers = array();
				    $headers[] = 'Accept: application/json';
				    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
				    $result2 = json_decode(curl_exec($ch), true);
				    if (curl_errno($ch)) {
				        echo 'Error:' . curl_error($ch);
				    }
				    curl_close($ch);
				    if ($result2['success']) {
						http_response_code(200);
						$len = $redis->lLen($login);
						if ($len > 5) {
							$redis->lRem($login, $redis->lindex($login, 0), 1);
						}
						$jti_new = rand(10000000,99999999);
						$res = $redis->lInsert($login, Redis::AFTER, $jti_new, $jti_new);
						if ($res == 0 || $res == -1) {
							$redis->rPush($login, $jti_new);
						} else {
							$n = 0;
							$redis->lRem($login, $jti_new, 1);
							while (($re = $redis->lInsert($login, Redis::AFTER, $r1 = rand(10000000,99999999), $r1)) != -1 && $n < 10) {
								$redis->lRem($login, $r1, 1);
							}
							$redis->rPush($login, $r1);
						}
						$data2['id'] = $result2['items'][0]['id'];
						$data2['login'] = $result['items'][0]['phone'];
						$data2['surname'] = $result['items'][0]['surname'];
						$data2['name'] = $result['items'][0]['name'];
						$data2['patronymic'] = $result['items'][0]['patronymic'];
						$data2['2fa'] = 0;
						$sub = "users";
						$aud = $result['items'][0]['id'];
						require_once('core.php');
						$payload = ['iss' => $iss,
						 'sub' => $sub,
						 'aud' => $aud,
						 'jti' => $jti,
						 'usd' => $usd,
						 'iat' => $iat,
						 'nbf' => $nbf,
						 'exp' => $exp
						];
						$data2['token'] = JWT::encode($payload, $key, 'HS512');
						http_response_code(200);
						echo json_encode($data2, JSON_UNESCAPED_UNICODE);
				    }
			    }
			}
		}
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
			// $sql = "SELECT `id`, `surname`, `name`, `patronymic` FROM `users` WHERE phone = ".$login;
			// $sql_prod = rawurlencode($sql);
			// $ch = curl_init();
			// curl_setopt($ch, CURLOPT_URL, 'http://127.0.0.1:9088/api/v1/db/search/query?q='.$sql_prod);
			// curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
			// curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
			// $headers = array();
			// $headers[] = 'Accept: application/json';
			// curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
			// $data2 = json_decode(curl_exec($ch),true)['items'][0];
			// if (curl_errno($ch)) {
			//   echo 'Error:' . curl_error($ch);
			// }
			// curl_close($ch);
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