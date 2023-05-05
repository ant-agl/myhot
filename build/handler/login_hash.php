<?php
http_response_code(401);
header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
// $_POST = json_decode(file_get_contents('php://input'), true);
// $_POST['login'] = "login2";
// $_POST['password'] = "password";
if(isset($_POST['login']) and isset($_POST['password'])){
	$login = htmlspecialchars(strip_tags(trim($_POST['login'])), ENT_QUOTES | ENT_SUBSTITUTE | ENT_HTML5);
	$salt_key = bin2hex(random_bytes(256));
	$login = strtolower($login);
	$sql = "SELECT `password`, `id` FROM `users` WHERE phone = ".$login;

  $ch = curl_init();
  curl_setopt($ch, CURLOPT_URL, 'http://127.0.0.1:9088/api/v1/db/search/query?q='.rawurlencode($sql));
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
  $headers = array();
  $headers[] = 'Accept: application/json';
  curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
  $result = json_decode(curl_exec($ch),true)['items'];
  // print_r($result);
  if (curl_errno($ch)) {
      echo 'Error:' . curl_error($ch);
  }
  curl_close($ch);
	$trial = false;
	$ttl = 120;
	if (!empty($result)) {
		$data = $result[0];
		// $login = trim($_POST['login']);
		// if (!preg_match("^\S*(?=\S{12,})(?=\S*[a-z])(?=\S*[A-Z])(?=\S*[\d])\S*$^", $password)) {
		// 	http_response_code(404);
		// 	exit;
		// }
		#проверки, на длину пароля, и подобное и наличие спецсимволов. иначе ошибка, некорректный логин или пароль все те же проверки,что и на js.
		$password = trim($_POST['password']);
		$sql = "SELECT `id`, `active_status`, `2fa` FROM `general` WHERE uid = ".$data['id'];
		$sql_prod = rawurlencode($sql);
	  $ch = curl_init();
	  curl_setopt($ch, CURLOPT_URL, 'http://127.0.0.1:9088/api/v1/db/search/query?q='.$sql_prod);
	  curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	  curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
	  $headers = array();
	  $headers[] = 'Accept: application/json';
	  curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
	  $result2 = json_decode(curl_exec($ch),true)['items'];
	  // print_r($result);
	  if (curl_errno($ch)) {
	      echo 'Error:' . curl_error($ch);
	  }
	  curl_close($ch);
		$trial = password_verify($password, $data['password']);
		if (!empty($result2)) {
			$data2 = $result2[0];
			if (!$data2['active_status']) $trial = false;
		}
		$hash_ver = hash('sha3-512', $login.$data['password'].$salt_key);
		$loss = [
			"login" => $login,
			"hash_verify" => $hash_ver
		];
		$isStored = apcu_store($login."__".$hash_ver, ['password' => $trial, "salt" => $salt_key, "ip" => GetIP(), "id" => $data2["id"], "dfa" => $data2["2fa"]], $ttl);
		// ip сохранить в сессию и сравнивать
		// время жизни сессии в связи с этим ограничить до 120 секунд. ограничить количество неудачных попыток. показывать время.
		// в идеале, можно в редис или apcu грузить. я бы грузил в apcu на 5 секунд. ключ тот же. 
		// это сохранить в кук файл. а остальные данные хранить в apcu . это позволит ускорить работу.session_create_id(string $prefix = "")
		// apcu это оперативка, сессии это диск. выбор очевиден.
		//!!! БЕЗ СЕССИЙ РАБОТАЕМ, РЕДИС + APCU? решаем под задачу.
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