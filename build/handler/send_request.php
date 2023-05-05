<?php
// if(isset($_SERVER['HTTP_X_REQUESTED_WITH']) && !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest'){
	http_response_code(404);
	// $_POST['email']  = "mailss";
	// $_POST['message']  = "mesassagal;jeklsed";
	if (isset($_POST['email'])) { $email=$_POST['email']; if ($email =='') { unset($email);} }
	if (isset($_POST['message'])) { $message=$_POST['message']; if ($message =='') { unset($message);} }
	if (isset($email)) {
		$email = stripslashes($email);
		$email = htmlspecialchars($email);
		$email = trim($email);
	} else {
		exit;
	}
	if (isset($message)) {
		$message = stripslashes($message);
		$message = htmlspecialchars($message);
		$message = trim($message);
	} else {
		exit;
	}
	$ip = GetIP();
	$time = date("Y-m-d H:i:s");
	// $_SERVER['HTTP_AUTHORIZATION'] = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJodHRwczovL3dlaG90ZWwucnUiLCJzdWIiOiJndWVzdCIsImF1ZCI6MiwianRpIjo3Mjk4ODYxMCwidXNkIjoie1wiaWRcIjoyLFwic3VybmFtZVwiOlwiXFx1MDQxNFxcdTA0NGRcXHUwNDMxXFx1MDQzOFxcdTA0M2FcIixcIm5hbWVcIjpcIlxcdTA0MTRcXHUwNDRkXFx1MDQzMVxcdTA0MzhcXHUwNDNhXCIsXCJwYXRyb255bWljXCI6XCJcXHUwNDE0XFx1MDQ0ZFxcdTA0MzFcXHUwNDM4XFx1MDQzYVwiLFwibG9naW5cIjpcImxvZ2luMlwifSIsImlhdCI6IjE2ODA1MDI4MjMiLCJuYmYiOjE2ODA1MDI4MjQsImV4cCI6MTY5MDg3MDgyNH0.zRRAZBuP0-aA2K8DYQ2vT4AQOI-h3HGbZbavR_JGjyTrD-ETCmYl5wAo8LtVL-zwyd1sE-rszxdNGE4NMe9tMw";
    require_once('help_auth.php');
	$user_auth_data = auth_data();
	if ($user_auth_data) {
		$uid = json_decode($user_auth_data) -> aud;
        $str = json_encode(array(
        	"id" => 0,
            "email" => $email,
            "text" => $message,
            "uid" => $uid,
            "ip" => $ip,
            "date" => $time 
        ), JSON_UNESCAPED_UNICODE);

	} else {
		$str = json_encode(array(
			"id" => 0,
            "email" => $email,
            "text" => $message,
            "ip" => $ip,
            "date" => $time 
        ), JSON_UNESCAPED_UNICODE);
	}
	$ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'http://127.0.0.1:9088/api/v1/db/search/namespaces/question/items?precepts=id=serial()&format=json');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $str);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
    $headers = array();
    $headers[] = 'Accept: application/json';
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    $result = json_decode(curl_exec($ch));
    // print_r($result);
    if (curl_errno($ch)) {
        echo 'Error:' . curl_error($ch);
    }
    curl_close($ch);
	if ($result ->updated) {
		http_response_code(200);
		$body = "Новая заявка на wehotel.ru \n
		Почта: ".$email."\n
		Сообщение: ".$message."\n
		Дата: ".$time;
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
		    $mail->addAddress('mr.dany2003@mail.ru');  
		    // $mail->addAddress('nightfuriya@yandex.ru');  
		    //$mail->addAddress(''); // Ещё один, если нужен

		// Отправка сообщения
		$mail->Subject = "Новая заявка на WEHOTEL";
		$mail->Body = $body;    

		// Проверяем отравленность сообщения
		if ($mail->send()) {$result = "success";} 
		else {$result = "error";}

		} catch (Exception $e) {
		    http_response_code(404);
		}
		exit;
	} else {
		http_response_code(502);
		exit;
	}
// }
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