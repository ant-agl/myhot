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
    return;
    $.ajax({
        type: 'POST',
        url: '',
        data
    });
});