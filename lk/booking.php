<?php
  $title = 'Бронирование';
  include "../header.php";
?>

<div class="filters">
  <button class="main__button active" data-filter="all">Все отели</button>
  <button class="main__button" data-filter="active">Действительные</button>
  <button class="main__button" data-filter="completed">Исполненные</button>
  <button class="main__button" data-filter="fail">Отказанные</button>
</div>

<div class="hotels">
  
</div>

<?php include '../scripts.php' ?>

<script src="../js/filter.js"></script>
<script src="../js/booking-data.js"></script>

<?php include '../footer.php' ?>
