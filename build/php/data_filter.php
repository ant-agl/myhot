<?php 
header('Content-Type: application/json');
header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
http_response_code(403);
$sql = "SELECT * FROM `filter_search`";
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
http_response_code(200);
echo json_encode($result["items"]);
curl_close($ch);
?>