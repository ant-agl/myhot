<?php
	use Firebase\JWT\JWT;
	use Firebase\JWT\Key;
	$domain="wehotel.ru"; //домен с которого выписали этот JWT
	$key="wehotel"; //ключ шифрования
	$iss ="https://{$domain}";
	// $sub="guest";//hotel, hotel_manager, hotel_admin, admin, techsupport, director статус и права пользователя
	if (!isset($jti_new)) {
		$jti_new = 0;
	}
	$jti=$jti_new;//уникальный идентификатор  сессии
	// $aud=$id; //id пользователя
	// $data = ['name' => "Имя",
	// 	'surname' => "Фамилия",
	// 	'patronymic' => "Отчество",
	// 	'birthday' => "Дата рождения"
	
	// ];//DATA,SUB ВЗЯТЬ ИЗ APCU ПРИ ПОМОЩИ КЛЮЧА ХЭША
	if (!isset($data2)) {
		$data2 = [];
	}
	$usd = json_encode($data2);
	//время действия токена NumericDate


	$iat = date('U'); // дата выдачи токена	
	$nbf = $iat + 1; // время через которое токен станет активен. полезная функция,для отсеивания ботов
	$exp = $nbf + 60*60*24*120;//срок действия 120 дней
	//$nbf = date('U',strtotime("+1 hour")); //не должен приниматься до этого момента времени
	//$exp=1360000000 надо использовать,
	if (!function_exists('decode_jwt'))   {
	  function decode_jwt($jwt,$key){
		try {
		 $decoded =  JWT::decode($jwt, new Key($key, 'HS512'));
		 return $decoded;
		} catch (LogicException  $e) {
			return false;
			//echo"Не верная конфигурация";
		 // errors having to do with environmental setup or malformed JWT Keys
		} catch (UnexpectedValueException $e) {
			return false;
			//echo"Токен не действителен";
		 // errors having to do with JWT signature and claims
		}
	}
	}
?>