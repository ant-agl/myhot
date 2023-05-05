<?php
require_once('vendor/autoload.php');
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
http_response_code(403);
/*$_SERVER['HTTP_AUTHORIZATION'] = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJodHRwczovL3dlaG90ZWwucnUiLCJzdWIiOiJ1c2VycyIsImF1ZCI6MiwianRpIjozMzI2MjMzMSwidXNkIjoie1wibmFtZVwiOlwiXFx1MDQxOFxcdTA0MzIyXFx1MDQzMFxcdTA0M2RcIixcInBhdHJvbnltaWNcIjpcIlxcdTA0MThcXHUwNDMyXFx1MDQzMFxcdTA0M2QyXFx1MDQzZVxcdTA0MzJcXHUwNDM4XFx1MDQ0N1wiLFwic3VybmFtZVwiOlwiXFx1MDQxOFxcdTA0MzJcXHUwNDMwXFx1MDQzZFxcdTA0M2VcXHUwNDMyMlwiLFwiaWRcIjoxLFwibG9naW5cIjpcImxvZ2luMlwiLFwiZGZhXCI6Mn0iLCJpYXQiOiIxNjgxMTQ1NTY2IiwibmJmIjoxNjgxMTQ1NTY3LCJleHAiOjE2OTE1MTM1Njd9.3y7aS7pPt75HmjLS3MtSVzm5YtBMRPgAGyZb3dRTIgS5oQgknRYSFjn28n_gR4w2msX3gho_rJpYCeYcHReehw";*/
require_once('help_auth.php');
$user_auth_data = auth_data();
if ($user_auth_data) {
    http_response_code(200);
    $id = json_decode($user_auth_data) -> aud;
    $sql = "SELECT `hotel_id` FROM favourites WHERE uid = ".$id;
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'http://127.0.0.1:9088/api/v1/db/search/query?q='.(rawurlencode($sql)));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
    $headers[] = 'Accept: application/json';
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    $result = json_decode(curl_exec($ch), true)['items'];
    if (curl_errno($ch)) echo 'Error:' . curl_error($ch);
	curl_close($ch);
    $arr = [];
    for ($i = 0; $i < count($result); $i++) $arr[$i] = $result[$i]['hotel_id'];
    echo json_encode($arr, JSON_UNESCAPED_UNICODE);
}