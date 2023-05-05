<?php
require_once('vendor/autoload.php');
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
http_response_code(401);
// $_SERVER['HTTP_AUTHORIZATION'] = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJodHRwczovL3dlaG90ZWwucnUiLCJzdWIiOiJ1c2VycyIsImF1ZCI6NDUsImp0aSI6ODMyODU1MjYsInVzZCI6IntcIm5hbWVcIjpcIndlZmV3XCIsXCJzdXJuYW1lXCI6XCJ3ZWZld2ZcIixcInBhdHJvbnltaWNcIjpcIndlZmVmd1wiLFwiaWRcIjoyNCxcImxvZ2luXCI6XCI3OTEzMTUzNTIyMFwiLFwiZGZhXCI6MH0iLCJpYXQiOiIxNjgyNzExODI5IiwibmJmIjoxNjgyNzExODMwLCJleHAiOjE2OTMwNzk4MzB9.USBDN_jSQna4lhDVidEhgGuHigWjb_HPJQidPiof7Ezpj1vKtxdFV9163PrisZPgoR-Hr1HnA_22x7smYivMFw";
//echo json_encode($_SERVER);
/*function handleAuthorizationHeader() {
  header("Access-Control-Allow-Origin: *"); // разрешаем доступ с любого домена
  header("Access-Control-Allow-Methods: *"); // разрешаем методы запросов
  header("Access-Control-Allow-Headers: *"); // разрешаем заголовок Authorization
  if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { // если метод запроса OPTIONS, то возвращаем пустой ответ
    http_response_code(204);
    exit();
  }
  $headers = apache_request_headers(); // получаем все заголовки запроса

  if (isset($headers['Authorization'])) { // если есть заголовок Authorization
    $token = $headers['Authorization']; // получаем токен
    // здесь можно провести проверку токена и выполнить нужные действия
  } else {
    http_response_code(401); // если заголовок Authorization отсутствует, то возвращаем ошибку 401
    exit();
  }
}
function getAuthorizationHeader(){
    $headers = null;
    if (isset($_SERVER['Authorization'])) {
        $headers = trim($_SERVER["Authorization"]);
    }
    elseif (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $headers = trim($_SERVER["HTTP_AUTHORIZATION"]);
    } 
    elseif (function_exists('apache_request_headers')) {
        $requestHeaders = apache_request_headers();
        $requestHeaders = array_combine(array_map('ucwords', array_keys($requestHeaders)), array_values($requestHeaders));

        if (isset($requestHeaders['Authorization'])) {
            $headers = trim($requestHeaders['Authorization']);
        }
    }

    return $headers;
}

function getBearerToken() {
    $headers = getAuthorizationHeader();

    if (!empty($headers)) {
        if (preg_match('/Bearer\s(\S+)/', $headers, $matches)) {
            return $matches[1];
        }
    }

    return null;
}

$headers = getallheaders(); // получаем все заголовки запроса
//echo json_encode(getBearerToken()); 
echo json_encode($headers);  
$token = $headers['Authorization']; 

//$authHeader = $token;

//$arr = explode(" ", $authHeader);
///echo $token;*/
//$_SERVER['HTTP_AUTHORIZATION'] = $arr[1];
require_once('help_auth.php');
$user_auth_data = auth_data();
if ($user_auth_data) {
    $data_decode_jwt = json_decode($user_auth_data,true);
    http_response_code(200);       
    echo $data_decode_jwt['usd'];
}
?>