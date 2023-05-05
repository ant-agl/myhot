<?php
http_response_code(403);
if (isset($_GET['id']) and isset($_GET['confirmation'])) {
	$id = $_GET['id']; 
	$id = stripslashes($id);
	$id = htmlspecialchars($id);
	$id = trim($id);
	$confirmation = $_GET['confirmation']; 
	$confirmation = stripslashes($confirmation);
	$confirmation = htmlspecialchars($confirmation);
	$confirmation = trim($confirmation);
	$mysalt1 = "salt123";
	$mysalt2 = "321slat";
	if (password_verify($mysalt1.$id.$mysalt2, $confirmation)) {
	    $sql = "UPDATE general SET email_confirm = true WHERE id = ".$id;
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
	    curl_close($ch);
	    print_r($result);
	    if (!empty($result['items'])){
			http_response_code(200);
			header("Location: https://wehotel.ru/");
			exit;
	    }
		 else {
			http_response_code(502);
			exit;
		    }
		mysqli_close($link);
	} else {
		http_response_code(502);
		exit;
	}
	mysqli_close($link);
}

?>