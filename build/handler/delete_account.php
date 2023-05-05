<?php
require_once('vendor/autoload.php');
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
http_response_code(403);
require_once('help_auth.php');
$_SERVER['HTTP_AUTHORIZATION'] = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJodHRwczovL3dlaG90ZWwucnUiLCJzdWIiOiJ1c2VycyIsImF1ZCI6MiwianRpIjo1NTE3OTM4MCwidXNkIjoie1wibmFtZVwiOlwiXFx1MDQxOFxcdTA0MzJcXHUwNDMwXFx1MDQzZDIyXCIsXCJwYXRyb255bWljXCI6XCJcXHUwNDE4XFx1MDQzMlxcdTA0MzBcXHUwNDNkXFx1MDQzZVxcdTA0MzIyMlxcdTA0MzhcXHUwNDQ3XCIsXCJzdXJuYW1lXCI6XCJcXHUwNDE4XFx1MDQzMlxcdTA0MzBcXHUwNDNkXFx1MDQzZVxcdTA0MzJcIixcImlkXCI6MSxcInBob25lXCI6Nzk2MTc5MTkzODMsXCJkZmFcIjoxfSIsImlhdCI6IjE2ODE0NTM5MDYiLCJuYmYiOjE2ODE0NTM5MDcsImV4cCI6MTY5MTgyMTkwN30.0dxtb8BHbfb95iWHjx3qrBHh4i_YFisomRzT8P6KlPr_63nNzyLa05fM8xjDnD1HSE9fSzo9Ij6XABbW_j9oUQ";
$user_auth_data = auth_data();
if ($user_auth_data) {
	$login = json_decode(json_decode($user_auth_data) -> usd) -> login;
	$gid = json_decode(json_decode($user_auth_data) -> usd) -> id;
	$id = json_decode($user_auth_data) -> aud;
	$auth_code = rand(1000,9999);
	$jti = json_decode($user_auth_data) -> jti;
	$ttl = 600;
	$isStored = apcu_store($login."-".$jti, ['auth_code' => $auth_code, 'ip' => GetIP()], $ttl);
	$sql = "SELECT `email` FROM users WHERE id = ".$id;
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
	    $mail->addAddress($result['items'][0]['email']);  
	    // $mail->addAddress('mr.dany2003@mail.ru');  
	    // $mail->addAddress('nightfuriya@yandex.ru');  
	    //$mail->addAddress(''); // Ещё один, если нужен

		// Отправка сообщения
		$mail->Subject = "Код";
		$mail->Body = $auth_code;    

		// Проверяем отравленность сообщения
		if ($mail->send()) {$result = "success";} 
		else {$result = "error";}
		http_response_code(200);
	} catch (Exception $e) {
	    http_response_code(404);
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