<?php
// // $cacheKey = 'product_1';
// // $ttl = 600; // 10 минут.
 
// // // Проверка доступности APCu
// // $isEnabled = apcu_enabled();
 
// // // Проверяет, есть ли данные в кэше по ключу
// // $isExisted = apcu_exists($cacheKey);
 
// // // Сохраняет данные в кэш. В случае успеха возвращает true
// // // Аргумент $ttl определяет, как долго будет храниться кэш (секунды)
// // //$isStored = apcu_store($cacheKey, ['name' => 'Demo product'], $ttl);
 
// // // Получает данные из кэша по ключу. В случае их отсутствия, вернет false
// // $data = apcu_fetch($cacheKey);

// // print_r($data);
// // // Удаляет данные из кэша по ключу
// // //$isDeleted = apcu_delete($cacheKey);
 
// $redis = new Redis();
// $redis->connect('localhost', 6379);
// $redis->auth(' ');
// if (!($redis->ping())) {
// 	echo "Redis error";
// }
// $redis->select(1);
// $jti_new = rand(1,10);
// echo $jti_new."\n";
// $_GET['login'] = "mail";
// $res = $redis->lInsert($_GET['login'], Redis::AFTER, $jti_new, $jti_new);
// if ($res == 0 || $res == -1) {
// 	$redis->rPush($_GET['login'], $jti_new);
// } else {
// 	$n = 0;
// 	$redis->lRem($_GET['login'], $jti_new, 1);
// 	while (($re = $redis->lInsert($_GET['login'], Redis::AFTER, $r1 = rand(1,10), $r1)) != -1 && $n < 10) {
// 		$redis->lRem($_GET['login'], $r1, 1);
// 	}
// 	$redis->rPush($_GET['login'], $r1);
// }
// // while ($redis->lInsert($_GET['login'], Redis::AFTER, $jti_new, $jti_new) != -1) {
// // 	$redis->lRem($_GET['login'], $jti_new, 1);
// // 	$jti_new = rand(1,3);
// // 	echo $jti_new;
// // }
// //$redis->rPush($_GET['login'], $jti_new);

require_once('vendor/autoload.php');
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
$_SERVER['HTTP_AUTHORIZATION'] = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJodHRwczovL3dlaG90ZWwucnUiLCJzdWIiOiJ1c2VycyIsImF1ZCI6MiwianRpIjo1NTE3OTM4MCwidXNkIjoie1wibmFtZVwiOlwiXFx1MDQxOFxcdTA0MzJcXHUwNDMwXFx1MDQzZDIyXCIsXCJwYXRyb255bWljXCI6XCJcXHUwNDE4XFx1MDQzMlxcdTA0MzBcXHUwNDNkXFx1MDQzZVxcdTA0MzIyMlxcdTA0MzhcXHUwNDQ3XCIsXCJzdXJuYW1lXCI6XCJcXHUwNDE4XFx1MDQzMlxcdTA0MzBcXHUwNDNkXFx1MDQzZVxcdTA0MzJcIixcImlkXCI6MSxcInBob25lXCI6Nzk2MTc5MTkzODMsXCJkZmFcIjoxfSIsImlhdCI6IjE2ODE0NTM5MDYiLCJuYmYiOjE2ODE0NTM5MDcsImV4cCI6MTY5MTgyMTkwN30.0dxtb8BHbfb95iWHjx3qrBHh4i_YFisomRzT8P6KlPr_63nNzyLa05fM8xjDnD1HSE9fSzo9Ij6XABbW_j9oUQ";
require_once('help_auth.php');
$user_auth_data = auth_data();
if ($user_auth_data) {
	print_r(json_decode($user_auth_data, true)['usd']);
}
// echo password_hash("123456", PASSWORD_DEFAULT)
?>