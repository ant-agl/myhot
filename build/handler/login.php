<?php
http_response_code(401);
//header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
// $_POST = json_decode(file_get_contents('php://input'), true);
//проверка, что все данные пришли,дальше проверка hash_ver.  
// $_POST['login'] = "login2";
// $_POST['hash_verify'] = "9325523f5e45062c7d8e15159f5b60a24341385d0fee02eb66071b697f4e30ebbff291a911778bcb5a7dfb78bec4049f70d0662cd500a16956b7c76c2e1681ae";
if(isset($_POST['login']) and isset($_POST['hash_verify'])){
	# Вытаскиваем из БД запись, у которой логин равняеться введенному
	$login = htmlspecialchars(strip_tags(trim($_POST['login'])), ENT_QUOTES | ENT_SUBSTITUTE | ENT_HTML5);
	$hash_ver = $_POST['hash_verify'];
	$data_apcu = apcu_fetch($login."__".$hash_ver);
	$ttl = 60;
	// $isStored = apcu_store($login + "_" + $hash_ver, ['password' => $trial, "salt" => $salt_key], $ttl)
	if ($data_apcu) {
		if($data_apcu['password']){
			if((strlen($login) > 4)){
				$sql = "SELECT `password`, `email` FROM `users` WHERE phone = ".$login;
				$sql_prod = rawurlencode($sql);
			  $ch = curl_init();
			  curl_setopt($ch, CURLOPT_URL, 'http://127.0.0.1:9088/api/v1/db/search/query?q='.$sql_prod);
			  curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
			  curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
			  $headers = array();
			  $headers[] = 'Accept: application/json';
			  curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
			  $data = json_decode(curl_exec($ch),true)['items'][0];
			  // print_r($result);
			  if (curl_errno($ch)) {
			      echo 'Error:' . curl_error($ch);
			  }
			  curl_close($ch);
				//$query = mysqli_query($link,"SELECT * FROM `user` WHERE login='".trim($_POST['login'])."' LIMIT 1");
				$hash_ver = hash('sha3-512', $login.$data['password'].$data_apcu['salt']);
				//удалить все данные по прошлому хэшу, и сохранить новые данные
				if (($hash_ver === $_POST['hash_verify']) and (GetIP() == $data_apcu['ip'])){
						$auth_code = rand(1000,9999);
						$isStored = apcu_store($login."__".$hash_ver, ['auth_code' => $auth_code, 'ip' => $data_apcu['ip'], 'id' => $data_apcu['id'] , 'dfa' => $data_apcu['dfa']], $ttl);
						http_response_code(200);
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
					    $mail->addAddress($data['email']);  
					    // $mail->addAddress('mr.dany2003@mail.ru');  
					    // $mail->addAddress('admin@wehotel.ru'); // Ещё один, если нужен

							// Отправка сообщения
							$mail->Subject = "Код";
							$mail->Body = $auth_code;    

							// Проверяем отравленность сообщения
							if ($mail->send()) {
								echo json_encode(array("status" => "ok"));
							}
						} catch (Exception $e) {
						    http_response_code(404);
						}
						//отправка письма с кодом авторизации на почту,телефон, мобильное приложение. Короче, вторая аутендефикация 
						//здесь ответ 200 + json с хэшем и id.этот хэш, ключ для apcu где лежит код из двухфакторки
				}
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