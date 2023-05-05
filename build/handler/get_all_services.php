<?php
http_response_code(200);
$sql = "SELECT * FROM services";
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'http://127.0.0.1:9088/api/v1/db/search/query?q='.(rawurlencode($sql)));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
$headers[] = 'Accept: application/json';
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
$result = json_decode(curl_exec($ch), true)['items'];
if (curl_errno($ch)) echo 'Error:' . curl_error($ch);
curl_close($ch);
// for ($i = 0; $i < count($result); $i++) {
//     $result2['id'][$i] = $result[$i]['id'];
//     $result2['name'][$i] = $result[$i]['name'];
//     $result2['category'][$i] = $result[$i]['category'];
// }
echo json_encode($result, JSON_UNESCAPED_UNICODE);
?>