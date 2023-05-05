<?php
http_response_code(403);
if (isset($_GET['id_hotel']) && is_numeric($_GET['id_hotel'])) {
    http_response_code(200);
    $idh = $_GET['id_hotel'];
    $sql = "SELECT `date`, `opinion`, `rating`, `cleanliness`, `staff`, `location`, `conveniences`, `comfort`, `ratio`, `reserve_id` FROM reviews WHERE hotel_id = ".$idh." INNER JOIN (SELECT `input_date`, `output_date` FROM reserve) ON reviews.reserve_id = reserve.id INNER JOIN (SELECT `id`, `img` FROM general) ON reviews.uid = general.uid INNER JOIN (SELECT `name` FROM users) ON reviews.uid = users.id INNER JOIN (SELECT `name`, `image` FROM rooms_search) ON reviews.room_id = rooms_search.id";
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'http://127.0.0.1:9088/api/v1/db/search/query?q='.(rawurlencode($sql)));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
    $headers[] = 'Accept: application/json';
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    $result = json_decode(curl_exec($ch), true)['items'];
    if (curl_errno($ch)) echo 'Error:' . curl_error($ch);
    curl_close($ch);
    for ($i = 0; $i < count($result); $i++) {
        $result[$i]['name'] = $result[$i]['joined_users'][0]['name'];
        $result[$i]['name_room'] = $result[$i]['joined_rooms_search'][0]['name'];
        $result[$i]['img_room'] = $result[$i]['joined_rooms_search'][0]['image'];
        $result[$i]['input_date'] = $result[$i]['joined_reserve'][0]['input_date'];
        $result[$i]['output_date'] = $result[$i]['joined_reserve'][0]['output_date'];
        if (isset($result[$i]['opinion']['well'])) $result[$i]['review_well'] = $result[$i]['opinion']['well'];
        if (isset($result[$i]['opinion']['badly'])) $result[$i]['review_badly'] = $result[$i]['opinion']['badly'];
        if ($result[$i]['joined_general'][0]['img']) $result[$i]['img_src'] = "https://wehotel.ru/img/user/".$result[$i]['joined_general'][0]['id'].".webp";
        unset($result[$i]['joined_general'], $result[$i]['joined_users'], $result[$i]['opinion'], $result[$i]['reserve_id'], $result[$i]['joined_rooms_search'], $result[$i]['joined_reserve']);
    }
    echo json_encode($result, JSON_UNESCAPED_UNICODE);
}
?>