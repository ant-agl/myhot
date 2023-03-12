<?php
    $title = 'Личные данные';
    include "../header.php";
?>

<div class="main__photo-and-input-name">
    <div class="main__photo">
        <!-- <img src="/img/photo.jpg" alt="photo" class="main__photo-img"> -->
    </div>
    <div class="main__header-forms">
        <div class="main__header-form"><input type="text" name="surname" class="input" placeholder="Иванов"><span class="main__header-data">Фамилия</span></div>
        <div class="main__header-form"><input type="text" name="name" class="input" placeholder="Иван"><span class="main__header-data">Имя</span></div>
        <div class="main__header-form"><input type="text" name="second_name" class="input" placeholder="Иванович"><span class="main__header-data">Отчество</span></div>
    </div>

</div>
<div class="main__footer-forms">
    <div class="main__footer-form"><input type="email" name="email" class="input footer-input" placeholder="ivanovivan@gmail.com"><span class="main__footer-data">Почта</span></div>
    <div class="main__footer-form"><input type="text" name="date" class="input footer-input" id="date" placeholder="01.01.2000"><span class="main__footer-data">Дата рождения</span></div>
    <div class="main__footer-form"><input type="tel" name="number" class="input footer-input number-input" placeholder="+7 (ХХХ) ХХХ ХХ 55"><span class="main__footer-data">Телефон</span></div>
    <div class="main__footer-form"><input type="txet" name="change_password" class="input footer-input" value="Был изменён месяц назад"><span class="main__footer-data">Пароль</span></div>
</div>
<div class="main__buttons">
    <div class="msg">Сохранено!</div>
    <button class="main__button change-data">
        <span class="change__text">Изменить личные данные</span>
        <span class="save__text">Сохранить изменения</span>
    </button>
</div>

<!-- <div class="modal">
    <div class="modal__content">
        <div class="modal__pass">
            <div class="modal__pass-first-page">
                <div class="modal__title">Придумайте новый пароль</div>
                <input class="modal__input-password modal__input" placeholder="Пароль"></input>
                <div class="modal__descr">
                    <div class="modal__descr-text modal__descr-one">*не менее 8 знаков</div>
                    <div class="modal__descr-text modal__descr-two">*должен состоять из латиницы, кириллицы и цифр</div>
                </div>
                <input class="modal__input-password-new modal__input" placeholder="Продублируйте пароль"></input>
                <div class="modal__stage-and-button">
                    <div class="modal__stage">1 из 2 этапов</div>
                    <button class="modal__right-btn">Далее <svg width="34" height="8" viewBox="0 0 34 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 3.5C0.723858 3.5 0.5 3.72386 0.5 4C0.5 4.27614 0.723858 4.5 1 4.5V3.5ZM33.3536 4.35355C33.5488 4.15829 33.5488 3.84171 33.3536 3.64645L30.1716 0.464466C29.9763 0.269204 29.6597 0.269204 29.4645 0.464466C29.2692 0.659728 29.2692 0.976311 29.4645 1.17157L32.2929 4L29.4645 6.82843C29.2692 7.02369 29.2692 7.34027 29.4645 7.53553C29.6597 7.7308 29.9763 7.7308 30.1716 7.53553L33.3536 4.35355ZM1 4.5H33V3.5H1V4.5Z" fill="#0E5E6F"/>
                        </svg>
                        </button>
                </div>
            </div>
            <div class="modal__pass-second-page"></div>
        </div>
        <div class="modal__email"></div>
    </div>
</div> -->

<?php include '../scripts.php' ?>
<script src="../js/user-data.js"></script>
<?php include '../footer.php' ?>