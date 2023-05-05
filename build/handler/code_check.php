<?php
require_once('vendor/autoload.php');
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
http_response_code(403);
require_once('help_auth.php');
/*$_SERVER['HTTP_AUTHORIZATION'] = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJodHRwczovL3dlaG90ZWwucnUiLCJzdWIiOiJ1c2VycyIsImF1ZCI6MiwianRpIjoxNTgxNzgwNiwidXNkIjoie1wibmFtZVwiOlwiXFx1MDQxOFxcdTA0MzJcXHUwNDMwXFx1MDQzZFwiLFwicGF0cm9ueW1pY1wiOlwiXFx1MDQxOFxcdTA0MzJcXHUwNDMwXFx1MDQzZFxcdTA0M2VcXHUwNDMyXFx1MDQzOFxcdTA0NDdcIixcInN1cm5hbWVcIjpcIlxcdTA0MThcXHUwNDMyXFx1MDQzMFxcdTA0M2RcXHUwNDNlXFx1MDQzMlwiLFwiaWRcIjoxLFwicGhvbmVcIjo3OTYxNzkxOTk5OSxcImRmYVwiOjJ9IiwiaWF0IjoiMTY4MTg0NjE5MyIsIm5iZiI6MTY4MTg0NjE5NCwiZXhwIjoxNjkyMjE0MTk0fQ.VS2ULVGJC2zpgr2O4bxUaGG4hulWouzAjslEQQWGaeeWuHMvhTBNA0_GihrkdqRVbL-k7kDYw72epNeFTU99IA";*/
$user_auth_data = auth_data();
// $_POST['code'] = 4954;
if (isset($_POST['code'])) {
	$code = $_POST['code'];
	if ($user_auth_data) {
		$login = json_decode(json_decode($user_auth_data) -> usd) -> phone;
		$dfa = json_decode(json_decode($user_auth_data) -> usd) -> dfa;
		$gid = json_decode(json_decode($user_auth_data) -> usd) -> id;
		$jti = json_decode($user_auth_data) -> jti;
		$id = json_decode($user_auth_data) -> aud;
		if (strlen($code) == 4 && ctype_digit((string)$code) && apcu_exists($login."_".$jti)) {
			$data = apcu_fetch($login."_".$jti);
			if ($code == $data['auth_code'] && GetIP() == $data['ip']) {
				$ar = [];
				$ar2 = [];
				http_response_code(200);
				$_POST = json_decode($data['data'], true);
				$check = false;
				$check2 = false;
				if (isset($_POST['change_pass'])) { 
					if ($_POST['change_pass'] != '') {
						$ar['password'] = password_hash($_POST['change_pass'], PASSWORD_DEFAULT);
						$ar2['change_pass'] = time();
						$check = true;
						$check2 = true;
					}
				}
				if (isset($_POST['birthday'])) { 
					if ($_POST['birthday'] != '') { 
						$ar['birthday'] = strtotime($_POST['birthday']);
						$check = true;
					}
				}
				if (isset($_POST['image'])) { 
					rename($_SERVER['DOCUMENT_ROOT']."/handler/temp/".$_POST['image'], $_SERVER['DOCUMENT_ROOT']."/img/user/".$_POST['image']);
					$ar2['img'] = true;
				}
				if (isset($_POST['2fa'])) { 
					switch ($_POST['2fa']) {
						case 'no':
							$ar2['2fa'] = 0;
							break;
						case 'mail':
							$ar2['2fa'] = 1;
							break;
						case 'phone':
							$ar2['2fa'] = 2;
							break;
						case 'app':
							$ar2['2fa'] = 3;
							break;
					}
					$check2 = true;
				}
				if (isset($_POST['email'])) { 
					if ($_POST['email'] != '') { 
						$ar['email'] = $_POST['email'];
						$ar2['email_confirm'] = false;
						$check = true;
						$check2 = true;
						$mysalt1 = "salt123";
						$mysalt2 = "321slat";
						$confirmation = password_hash($mysalt1.$gid.$mysalt2, PASSWORD_DEFAULT);
						$link_h = "https://wehotel.ru/handler/confirm_email.php?id=".$gid."&confirmation=".$confirmation;
						require 'phpmailer/PHPMailer.php';
						require 'phpmailer/SMTP.php';
						require 'phpmailer/Exception.php';
						$mail = new PHPMailer\PHPMailer\PHPMailer();
						try {
						    $mail->isSMTP();   
						    $mail->CharSet = "UTF-8";
						    $mail->SMTPAuth   = true;
						    $mail->SMTPDebug = 2;
						    $mail->Debugoutput = function($str, $level) {$GLOBALS['status'][] = $str;};

						    // Настройки вашей почты
						    $mail->Host       = 'smtp.yandex.ru'; // SMTP сервера вашей почты
						    $mail->Username   = 'devops@web-gen.ru'; // Логин на почте
						    $mail->Password   = 'kuwjjqbxuwmtcwvi'; // Пароль на почте
						    $mail->SMTPSecure = 'ssl';
						    $mail->Port       = 465;
						    $mail->setFrom('devops@web-gen.ru', 'WEB-GEN'); // Адрес самой почты и имя отправителя
						    $mail->DKIM_domain = 'web-gen.ru';
						    $mail->DKIM_public = '../../key/public.pem';
						    $mail->DKIM_selector = 'mail';
						    $mail->DKIM_passphrase = '';
						    $mail->DKIM_identity = $mail->From;

						    // Получатель письма
						    $mail->addAddress($_POST['email']);  
						    // $mail->addAddress('mr.dany2003@mail.ru');  
						    // $mail->addAddress('nightfuriya@yandex.ru');  
						    //$mail->addAddress(''); // Ещё один, если нужен

							// Отправка сообщения
							$mail->Subject = "Подтверждение почты";
							$mail->Body = $link_h;    

							// Проверяем отравленность сообщения
							if ($mail->send()) {$result = "success";} 
							else {$result = "error";}
							http_response_code(200);
						} catch (Exception $e) {
						    http_response_code(404);
						}
					}
				}
				if (isset($_POST['name'])) { 
					if ($_POST['name'] != '') { 
						$ar['name'] = $_POST['name'];
						$check = true;
					}
				}
				if (isset($_POST['phone'])) { 
					if ($_POST['phone'] != '') { 
						$ar['phone']= (int)$_POST['phone'];
						$check = true;
					}
				}
				if (isset($_POST['patronymic'])) { 
					if ($_POST['patronymic'] != '') { 
						$ar['patronymic'] = $_POST['patronymic'];
						$check = true;
					}
				}
				if (isset($_POST['surname'])) { 
					if ($_POST['surname'] != '') {
						$ar['surname'] = $_POST['surname'];
						$check = true;
					}
				}
				$arr = array_merge(request('query?q='.rawurlencode("SELECT * FROM users WHERE id = ".$id), 'GET')['items'][0], $ar);
				if ($check) {
			    $result = request('namespaces/users/items?format=json', 'PUT', $arr);
				}
				$arr2 = array_merge(request('query?q='.rawurlencode("SELECT * FROM general WHERE uid = ".$id), 'GET')['items'][0], $ar2);
				if ($check2) {
			    $result = request('namespaces/general/items?format=json', 'PUT', $arr2);
				}
				$redis = new Redis();
				$redis->connect('localhost', 6379);
				$redis->auth(' ');
				if (!($redis->ping())) {
					echo "Redis error";
				}
				$redis->select(2);
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
				$data2 = request('query?q='.rawurlencode("SELECT `id`, `surname`, `name`, `patronymic`, `phone` FROM `users` WHERE id = ".$id), 'GET')['items'][0];
				$aud = $data2['id'];
				$data2['id'] = $gid;
				$data2['surname'] = $arr['surname'];
				$data2['name'] = $arr['name'];
				$data2['patronymic'] = $arr['patronymic'];
				$data2['dfa'] = $arr2['2fa'];
				// $sub = $data['role'];
				$sub = "users";
				require('core.php');
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
				// setcookie("token", $data['token'], time() + 86400);
				http_response_code(200);
				echo json_encode($data2, JSON_UNESCAPED_UNICODE);
			}
		}
	}
}
function request($url, $type, $arr = false) {
	$ch = curl_init();
  curl_setopt($ch, CURLOPT_URL, 'http://127.0.0.1:9088/api/v1/db/search/'.$url);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
  if ($type != 'GET') {
  	$str = json_encode($arr);
  	curl_setopt($ch, CURLOPT_POSTFIELDS, $str);
  }
  curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $type);
  curl_setopt($ch, CURLOPT_HTTPHEADER, array('Accept: application/json'));
  $result = json_decode(curl_exec($ch), true);
  if (curl_errno($ch)) {
      echo 'Error:' . curl_error($ch);
  }
  curl_close($ch);
  return $result;
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