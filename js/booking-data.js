$.get('', data => {
  data = [
    {
      img: '../img/hotels/1.png',
      name: 'Отель Marriott Royal Aurora',
      status: 'active',
      geo: 'Москва, Россия',
      dates: '01.01.2023 - 10.01.2023',
      peoples: '2 взрослых, 1 ребенок',
      price: '10 000 руб.',
      fullPrice: '50 000 руб.'
    },
    {
      img: '../img/hotels/2.png',
      name: 'Отель Novotel',
      status: 'completed',
      geo: 'Москва, Россия',
      dates: '01.01.2023 - 10.01.2023',
      peoples: '2 взрослых, 1 ребенок',
      price: '10 000 руб.',
      fullPrice: '50 000 руб.'
    },
    {
      img: '../img/hotels/3.png',
      name: 'Linda Resort Hotel',
      status: 'fail',
      geo: 'Манавгат, Турция',
      dates: '01.01.2023 - 10.01.2023',
      peoples: '2 взрослых, 1 ребенок',
      price: '10 000 руб.',
      fullPrice: '50 000 руб.'
    },
  ];

  let html = '';
  data.forEach(hotel => {
    let status = '';
    let statusClass = '';
    switch (hotel.status) {
      case 'active':
        status = 'Активен';
        statusClass = 'value_active';
        break; 
      case 'completed':
        status = 'Выполнен';
        statusClass = 'value_completed';
        break; 
      case 'fail':
        status = 'Отказ';
        statusClass = 'value_fail';
        break; 
    }

    html += `
      <div class="hotel-card" data-filter-item="${hotel.status}">
        <div class="hotel-card__head">
          <div class="hotel-card__img">
            <img src="${hotel.img}" alt="${hotel.name}">
          </div>
          <div class="hotel-card__main-info">
            <div class="hotel-card__status">
              <span>Статус</span>
              <span class="value ${statusClass}">${status}</span>
            </div>
            <div class="hotel-card__name">
              ${hotel.name}
            </div>
            <div class="hotel-card__geo">
              ${hotel.geo}
            </div>
          </div>
        </div>
        <div class="hotel-card__info">
          <div class="hotel-card__info-row">
            <span class="hotel-card__info-title">Дата бронирования</span>
            <span class="hotel-card__info-value">${hotel.dates}</span>
          </div>
          <div class="hotel-card__info-row">
            <span class="hotel-card__info-title">Количество человек</span>
            <span class="hotel-card__info-value">${hotel.peoples}</span>
          </div>
          <div class="hotel-card__info-row">
            <span class="hotel-card__info-title">Стоимость за номер</span>
            <span class="hotel-card__info-value">${hotel.price}</span>
          </div>
          <div class="hotel-card__info-row">
            <span class="hotel-card__info-title">Общая стоимость</span>
            <span class="hotel-card__info-value">${hotel.fullPrice}</span>
          </div>
        </div>
      </div>
    `;
  });
  if (data.length % 2 != 0) 
    html += '<div class="hotel-card hotel-card_hidden"></div>';

  $('.hotels').html(html);
  let filter = new Filter($('.filters'), $('.hotel-card'));
  filter.addExceptions('hotel-card_hidden');
});