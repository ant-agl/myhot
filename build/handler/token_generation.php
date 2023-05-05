<?php
require_once('vendor/autoload.php');
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
http_response_code(403);
// $_POST = json_decode(file_get_contents('php://input'), true);
$text = "Не стоит выполнять, нелегетимные запросы";
// $_POST['code'] = "60048048";
// $_POST['login'] = "login2";
// $_POST['hash_verify'] = "9325523f5e45062c7d8e15159f5b60a24341385d0fee02eb66071b697f4e30ebbff291a911778bcb5a7dfb78bec4049f70d0662cd500a16956b7c76c2e1681ae";
// досрочно снять можно только через тех поддержку. или смену пароля. соотвественно нужен счётчик и поле блокировки.
if(isset($_POST['code']) and isset($_POST['login']) and isset($_POST['hash_verify'])){
	$code = trim($_POST['code']);

	$login = $_POST['login'];
	$hash = $_POST['hash_verify'];
	if (strlen($code) == 4 && ctype_digit($code) && apcu_exists($login."__".$hash)) {
		$data = apcu_fetch($login."__".$hash);
		if ($code == $data['auth_code']) {
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
			$sql = "SELECT `id`, `surname`, `name`, `patronymic` FROM `users` WHERE phone = ".$login;
			$sql_prod = rawurlencode($sql);
			$ch = curl_init();
			curl_setopt($ch, CURLOPT_URL, 'http://127.0.0.1:9088/api/v1/db/search/query?q='.$sql_prod);
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
			curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
			$headers = array();
			$headers[] = 'Accept: application/json';
			curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
			$data2 = json_decode(curl_exec($ch),true)['items'][0];
			if (curl_errno($ch)) {
			  echo 'Error:' . curl_error($ch);
			}
			curl_close($ch);
			$data2['login'] = $login;
			$data2['dfa'] = $data['dfa'];
			// $sub = $data['role'];
			$sub = "users";
			$aud = $data2['id'];
			$data2['id'] = $data['id'];
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
			// setcookie("token", $data['token'], time() + 86400);
			http_response_code(200);
			echo json_encode($data2, JSON_UNESCAPED_UNICODE);
		}
		
	} 
	//проверки входных данных.
	//сравнить ip; сравнить id = с id из кэша. hash использовать как ключ
	//каждое поле,проверка на инъекцию или js.
}
else echo $text;
?>