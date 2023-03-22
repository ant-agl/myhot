import Modal from './Modal';
import ConfirmPassword from './ConfirmPassword.js';

let confirmPass = new ConfirmPassword('.input-code-confirm', '.btn-confirm-password');
let modalConfirm = new Modal('#modal-confirm-password', {
    closeToBackground: false,
    beforeOpen: () => {
        confirmPass.clearAll();
        confirmPass.focusFirst();
        return true;
    }
});
confirmPass.afterSendSuccess = () => {
    modalConfirm.close();
}

$('.input').prop('disabled', true);
$('.change-data').on('click', function() {
    $(this).toggleClass('active');
    $('.input').prop('disabled', !$(this).hasClass('active'));
    if ($(this).hasClass('active')) {
        $('[name="change_password"]')
            .val('')
            .attr('type', 'password');

        $('.change-data-background').remove();
        $('body').append('<div class="change-data-background"></div>');
    } else {
        $('[name="change_password"]')
            .attr('type', 'text');
        let $bg = $('.change-data-background');
        $bg.addClass('remove');
        setTimeout(() => {
            $bg.remove();
        }, 200);
    }
});



$('.change-data').on('click', function() {
    if ($(this).hasClass('active')) return;

    let fio = [];

    let data = {};
    $('.input').each((i, item) => {
        let name = $(item).attr('name');
        let val = $(item).val().trim();
        let lastVal = $(item).data('last-value');
        if (val && val != lastVal) {
            data[name] = val;
            $(item).data('last-value', val);
        }
        switch (name) {
            case 'surname':
            case 'name':
            case 'second_name':
                fio.push(val);
                break;
        }
        $('.profile-menu__item a').first().text(fio.join(' '));
    });
    
    if (data.change_password) {
        $('[name="change_password"]').val('Был изменен сегодня');
    } else {
        let lastVal = $('[name="change_password"]').data('last-value');
        $('[name="change_password"]').val(lastVal);
    }

    $('.msg').addClass('active');
    setTimeout(() => {
        $('.msg').removeClass('active');
    }, 1500);
    
    if (data.email || data.number || data.change_password) {
        modalConfirm.open();
    }



    console.log(data);
    return;
    $.ajax({
        type: 'POST',
        url: '',
        data
    });
});

$('.input-avatar').on('change', function() {
    let file = this.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function() {
        $('.main__photo-img').attr('src', reader.result);
    }
});