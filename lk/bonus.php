<?php
  $title = 'Бонусная программа';
  include "../header.php";
?>

<div class="balance-bonus">
  <span>Баланс бонусов</span>
  <span class="balance-bonus__value"></span>
</div>

<div class="table-block">
  <table class="table">
    <thead>
      <tr>
        <th>Наименование отеля</th>
        <th>Город</th>
        <th>Стоимость</th>
        <th>Количество бонусов</th>
      </tr>
    </thead>
    <tbody>
      
    </tbody>
  </table>
</div>

<?php include '../scripts.php' ?>
<script src="../js/bonus-data.js"></script>
<?php include '../footer.php' ?>
