<?php
require_once('../handler/db.php');
require_once('../handler/help_auth.php');
if ($token = auth_data()) {
    $id = json_decode($token) -> aud;
    $req = mysqli_query($link, "SELECT `uid`, `sub` FROM `general` WHERE `id` = '".$id."'");
    $res = mysqli_fetch_assoc($req);
    $result = mysqli_query($link, "SELECT `surname`, `name`, `patronymic`, `email`, `birthday`, `phone` FROM ".$res['sub']." WHERE `id` = ".$res['uid']." LIMIT 1");
    $res = mysqli_fetch_assoc($result);
    echo(json_encode($res, JSON_UNESCAPED_UNICODE));
}
?>