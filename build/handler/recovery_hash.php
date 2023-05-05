<?php
http_response_code(403);
if(isset($_POST['login'])){
	$login = htmlspecialchars(strip_tags(trim($_POST['login'])), ENT_QUOTES | ENT_SUBSTITUTE | ENT_HTML5);
	$salt_key = bin2hex(random_bytes(256));
	$login = strtolower($login);
	$sql = "SELECT `id`,'email' FROM `users` WHERE phone = ".$login;
  $ch = curl_init();
  curl_setopt($ch, CURLOPT_URL, 'http://127.0.0.1:9088/api/v1/db/search/query?q='.rawurlencode($sql));
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
  $headers = array();
  $headers[] = 'Accept: application/json';
  curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
  $result = json_decode(curl_exec($ch),true)['items'];
  if (curl_errno($ch)) echo 'Error:' . curl_error($ch);
	$trial = false;
	$ttl = 60;
	if (!empty($result)) {
		$data = $result[0];
		$sql = "SELECT `id`, `active_status`, `2fa` FROM `general` WHERE uid = ".$data['id'];
	  curl_setopt($ch, CURLOPT_URL, 'http://127.0.0.1:9088/api/v1/db/search/query?q='.rawurlencode($sql));
	  $result2 = json_decode(curl_exec($ch),true)['items'];
	  // print_r($result);
	  if (curl_errno($ch))  echo 'Error:' . curl_error($ch);
	  curl_close($ch);
		if (!empty($result2)) {
			$data2 = $result2[0];
			if (!$data2['active_status']) $trial = false;
		}
		$auth_code = rand(1000,9999);
		$array_dfa = ['no','mail','phone','app'];
		$hash_ver = hash('sha3-512', $login.$salt_key);
		$loss = [
			"login" => $login,
			"hash_verify" => $hash_ver,
			"2fa" => $array_dfa[$data2['2fa']]
		];
		$isStored = apcu_store($login."_recovery_".$hash_ver, ['auth_code' => $auth_code,'active' => $trial, "salt" => $salt_key, "ip" => GetIP(), "id" => $data["id"], "dfa" => $data2["2fa"]], $ttl);
		switch($data2['2fa']){
			case 1: 
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
					    $mail->addAddress($data['email']);  
					    // $mail->addAddress('mr.dany2003@mail.ru');  
					    // $mail->addAddress('admin@wehotel.ru'); // Ещё один, если нужен

							// Отправка сообщения
							$mail->Subject = "Код";
							$mail->Body = $auth_code;    

							// Проверяем отравленность сообщения
							if (!$mail->send()) {
								 http_response_code(502);
							}
						} catch (Exception $e) {
						    http_response_code(404);
						}
						break;
			default:
							$wa_idInstance = '1101807908';
							$wa_apiTokenInstance = '9325191bceec41db92e9c242e4bf3c0fa5242c113b174bfebd';
							$data = array(
								"chatId"=> $login."@c.us",
								"message"=> "Код: ".$auth_code
							);		
							$datap = array(
								"phoneNumber" => $phone
							);	
							$ch = curl_init('https://api.green-api.com/waInstance'.$wa_idInstance.'/CheckWhatsapp/'.$wa_apiTokenInstance);
							curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));
							curl_setopt($ch, CURLOPT_POST, 1);
							curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($datap, JSON_UNESCAPED_UNICODE)); 
							curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
							curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
							curl_setopt($ch, CURLOPT_HEADER, false);
							curl_close($ch);
							$res =  json_decode(curl_exec($ch), true);
							if($res['existsWhatsapp']){	
								$ch = curl_init('https://api.green-api.com/waInstance'.$wa_idInstance.'/SendMessage/'.$wa_apiTokenInstance);
								curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));
								curl_setopt($ch, CURLOPT_POST, 1);
								curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data, JSON_UNESCAPED_UNICODE)); 
								curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
								curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
								curl_setopt($ch, CURLOPT_HEADER, false);
								$res = curl_exec($ch);
								curl_close($ch);	
							}
							break;
		}
		http_response_code(200);
		echo json_encode($loss);
		exit;
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