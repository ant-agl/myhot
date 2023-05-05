<?php 
//https://habr.com/ru/post/354034/
if (isset($_GET['search']) && trim($_GET['search']) !="") $search = addslashes(htmlspecialchars(strip_tags(trim($_GET['search'])))); 
else  $search = '';
$sql = "SELECT name,city,country FROM hotel_search ";
if($search)	$sql.="WHERE search = '".$search."*~' ";
$sql_prod = rawurlencode($sql.'LIMIT 3');
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'http://127.0.0.1:9088/api/v1/db/search/query?q='.$sql_prod);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
$headers[] = 'Accept: application/json';
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
$result = json_decode(curl_exec($ch),true);
if (curl_errno($ch)) echo 'Error:' . curl_error($ch);
$hotel = $result["items"];
$sql = "SELECT name FROM city ";
if($search)	$sql.="WHERE name = '".$search."*~'";
$sql_prod = rawurlencode($sql.'LIMIT 5');
curl_setopt($ch, CURLOPT_URL, 'http://127.0.0.1:9088/api/v1/db/search/query?q='.$sql_prod);
$result = json_decode(curl_exec($ch),true);
if (curl_errno($ch)) echo 'Error:' . curl_error($ch);
$response = ["city"=>$result["items"],"hotel"=>$hotel];
http_response_code(200);
echo json_encode($response);

curl_close($ch);

?>