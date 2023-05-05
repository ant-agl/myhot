<?php
	// $_POST['email'] = "mr.dany2003@mail.ru";
	// $_POST['name'] = "Даниил";
	// $_POST['surname'] = "Антонов";
	// $_POST['patronymic'] = "Олегович";
	// $_POST['phone'] = 79780346375;
	// $_POST['date'] = "28.11.2003";
	// $_POST['password'] = "password";


    if (isset($_POST['email'])) { $email = $_POST['email'];} else { $email = "";}
	if (isset($_POST['name'])) { $name=$_POST['name']; if ($name =='') { unset($name);} }
	if (isset($_POST['surname'])) { $surname=$_POST['surname']; if ($surname =='') { unset($surname);} }
	if (isset($_POST['patronymic'])) { $patronymic=$_POST['patronymic']; if ($patronymic =='') { unset($patronymic);} }
	if (isset($_POST['phone'])) { $phone=$_POST['phone']; if ($phone =='') { unset($phone);} }
	if (isset($_POST['date'])) { $date=$_POST['date']; if ($date =='') { unset($date);} }
	// if (isset($_POST['password'])) { $password=$_POST['password']; if ($password =='') { unset($password);} }
	//http_response_code(401);
	//print_r($_POST);
 if (!isset($name) or !isset($email) or !isset($surname) or !isset($phone) or !isset($date) ){ //если пользователь не ввел логин или пароль, то выдаем ошибку и останавливаем скрипт
		http_response_code(401);
		exit;	
    }
    //если логин и пароль введены, то обрабатываем их, чтобы теги и скрипты не работали, мало ли что люди могут ввести
    $email = stripslashes($email);
    $email = htmlspecialchars($email);
    $name = stripslashes($name);
    $name = htmlspecialchars($name);
	$surname = stripslashes($surname);
    $surname = htmlspecialchars($surname);
    if (isset($patronymic)) {
		$patronymic = stripslashes($patronymic);
	    $patronymic = htmlspecialchars($patronymic);
		$patronymic = trim($patronymic);
    }
	$phone = stripslashes($phone);
    $phone = htmlspecialchars($phone);
	$date = stripslashes($date);
    $date = htmlspecialchars($date);
 //удаляем лишние пробелы
    $email = trim($email);
	$name = trim($name);
    $surname = trim($surname);
    $phone = trim($phone);
	$date = trim($date);

 // подключаемся к базе
 // проверка валидности
	$sql = "SELECT `id` FROM users WHERE phone = ".$phone;
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
    if (!empty($result['result'])) {
			http_response_code(403);
			$retunStatus = ['status' => 'Error',
				'description' => "Извините, введённый вами телефон уже зарегистрирован. Введите другой логин.",
				'code' => "403"
			];
			echo (json_encode($retunStatus));
			exit;
    }
	// $coin = 500;
 	// если такого нет, то сохраняем данные
   	// Проверяем, есть ли ошибки
	if (strlen($phone) == 11)	{
		$redis = new Redis();
		$redis->connect('localhost', 6379);
		$redis->auth(' ');
		if (!($redis->ping())) {
		   echo "Redis error";
		}
		$redis->select(2);
		$auth_code = rand(1000,9999);
		$salt_key = bin2hex(random_bytes(256));
		$hash_ver = hash('sha3-512', $phone.$salt_key);
		$loss = [
			"login" => $phone,
			"hash_verify" => $hash_ver
		];
		$ttl = 1200;
		$isStored = apcu_store($phone."_-_".$hash_ver, ["salt" => $salt_key, "ip" => GetIP(), 'auth_code' => $auth_code], $ttl);
		$datai = array('name' => $name, 'surname' => $surname, 'email' => $email, 'birthday' => strtotime($date), 'phone' => $phone);
		if (isset($patronymic)) {
			$datai['patronymic'] = $patronymic;
		}
		$result_json = json_encode($datai, JSON_UNESCAPED_UNICODE);
		$redis->rawCommand('SET', $phone."_-_".$hash_ver, $result_json, 'EX', $ttl);
		$wa_idInstance = '1101807908';
		$wa_apiTokenInstance = '9325191bceec41db92e9c242e4bf3c0fa5242c113b174bfebd';
		$data = array(
			"chatId"=> $phone."@c.us",
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
		$res = curl_exec($ch);
		curl_close($ch);
		$res = json_decode($res, true);
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
			http_response_code(200);
			echo json_encode($loss);		
		}
	}
    // if ($result2){	
	// 		$query = mysqli_query($link,"SELECT * FROM `user` WHERE email='".$email."' LIMIT 1");
	// 		$data = mysqli_fetch_assoc($query);
	// 		$_SESSION['id'] = $data['id'];
	// 		$_SESSION['email'] = mb_strtolower($data['email']);
	// 		$_SESSION['name'] = $data['name'];
	// 		$_SESSION['number'] = $data['number'];
	// 		$_SESSION['surname'] = $data['surname'];
	// 		$_SESSION['patronic'] = $data['patronic'];
	// 		$_SESSION['coin'] = $data['coin'];
	// 		$_SESSION['date'] =$data['date'];
	// 		http_response_code(200);
	// 		exit;
    // }
	// else {
	// 	http_response_code(502);
	// 	exit;
	// 	}
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