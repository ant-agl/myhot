import 'air-datepicker/air-datepicker.css';
import AirDatepicker from 'air-datepicker';

$('.main').css('min-height', $(window).outerHeight() - $('.header').outerHeight());
$(window).resize(() => {
    $('.main').css('min-height', $(window).outerHeight() - $('.header').outerHeight());
});

new AirDatepicker('#date', {
    autoClose: true,
    position: 'bottom center'
});

$('.input').prop('disabled', true);
$('.change-data').on('click', function() {
    $(this).toggleClass('active');
    $('.input').prop('disabled', !$(this).hasClass('active'));
    if ($(this).hasClass('active')) {
        $('[name="change_password"]').val('');

        $('.change-data-background').remove();
        $('body').append('<div class="change-data-background"></div>');
    } else {
        let $bg = $('.change-data-background');
        $bg.addClass('remove');
        setTimeout(() => {
            $bg.remove();
        }, 200);
    }
});

$('.change-data').on('click', function() {
    if ($(this).hasClass('active')) return;

    let data = {};
    $('.input').each((i, item) => {
        let name = $(item).attr('name');
        data[name] = $(item).val().trim();
    });
    
    $('.msg').addClass('active');
    setTimeout(() => {
        $('.msg').removeClass('active');
    }, 1500);
    
    console.log(data);

    if (data.change_password != '') {
        $('[name="change_password"]').val('Был изменен сегодня');
    } else {
        let lastVal = $('[name="change_password"]').data('last-value');
        $('[name="change_password"]').val(lastVal);
    }
    return;
    $.ajax({
        type: 'POST',
        url: '',
        data
    });
});

$('[name="number"]')
  .mask('+7 (000) 000-00-00', {
    placeholder: '+7 (___) ___-__-__'
  });