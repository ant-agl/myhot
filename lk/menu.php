<?php
  function getActive($thisUrl) {
    $url = basename($_SERVER['REQUEST_URI']);
    $url = explode('?', $url);
    $url = $url[0];
    if (empty($url) || $url == 'lk') $url = 'index.php';
    return $url == $thisUrl ? 'main__menu-item_active' : '';
  }
?>
<div class="main__menu">
  <ul class="main__menu-list">
    <li class="main__menu-item <?= getActive('index.php') ?>">
      <a href="index.php" class="main__menu-link">Личные данные</a>
    </li>
    <li class="main__menu-item <?= getActive('booking.php') ?>">
      <a href="booking.php" class="main__menu-link">Бронирование</a>
    </li>
    <li class="main__menu-item <?= getActive('favourites.php') ?>">
      <a href="favourites.php" class="main__menu-link">Избранное</a>
    </li>
    <li class="main__menu-item <?= getActive('reviews.php') ?>">
      <a href="reviews.php" class="main__menu-link">Отзывы</a>
    </li>
    <li class="main__menu-item <?= getActive('bonus.php') ?>"> 
      <a href="bonus.php" class="main__menu-link">Бонусная программа</a>
    </li>
    <li class="main__menu-item">
      <a href="#" class="main__menu-link">Выйти</a>
    </li>
  </ul>
</div>