<?php
require_once('vendor/autoload.php');
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
function auth_data() {
    $headers = getallheaders(); // получаем все заголовки запроса
    if (isset($headers['X-Auth'])) {  
      $_SERVER['HTTP_AUTHORIZATION'] = $headers['X-Auth']; 
        if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
            require_once('core.php');
            $dec_jwt = decode_jwt($_SERVER['HTTP_AUTHORIZATION'], $key);
            if ($dec_jwt) { 
                $redis = new Redis();
                $redis->connect('localhost', 6379);
                $redis->auth(' ');
                if (!($redis->ping())) {
                    echo "Redis error";
                }
                $redis->select(2);
                // print_r($dec_jwt -> usd);
                $res = $redis->lRange(json_decode($dec_jwt -> usd, true)['login'], 0, -1);
                if (in_array($dec_jwt -> jti, array_values($res))) {
        
                    $sql = "SELECT `active_status` FROM `general` WHERE uid = ".$dec_jwt -> aud;
                    $ch = curl_init();
                    curl_setopt($ch, CURLOPT_URL, 'http://127.0.0.1:9088/api/v1/db/search/query?q='.(rawurlencode($sql)));
                    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
                    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
                    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Accept: application/json'));
                    $result = json_decode(curl_exec($ch), true)['items'];
                    if (curl_errno($ch)) {
                      echo 'Error:' . curl_error($ch);
                    }
                    curl_close($ch);
                    if (!empty($result)) {
                        if ($result[0]['active_status']) {
                            return json_encode($dec_jwt);              
                        }
                    }
                }
            }
        }
        return false;
    }
}
?>