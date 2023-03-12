$.get('', data => {
  data = {
    balance: 345,
    hotels: [
      {
        img: '../img/hotels/1.png',
        name: 'Отель Marriott Royal Aurora',
        geo: 'Москва, Россия',
        price: '20 300 руб.',
        bonus: 100
      },
      {
        img: '../img/hotels/2.png',
        name: 'Отель Novotel',
        geo: 'Москва, Россия',
        price: '10 500 руб.',
        bonus: 200
      },
      {
        img: '../img/hotels/3.png',
        name: 'Linda Resort Hotel',
        geo: 'Манавгат, Турция',
        price: '5 400 руб.',
        bonus: -250
      },
    ]
  };

  let html = '';
  data.hotels.forEach(hotel => {
    html += `
      <tr>
        <td>
          <div class="table__image-block">
            <img src="${hotel.img}" alt="${hotel.name}">
            <span>${hotel.name}</span>
          </div>
        </td>
        <td>${hotel.geo}</td>
        <td class="nowrap">${hotel.price}</td>
        <td>
          <span class="${hotel.bonus >= 0 ? 'bonus_positive' : 'bonus_negative'}">
            ${hotel.bonus >= 0 ? '+' : ''}${hotel.bonus}
          </span>
        </td>
      </tr>
    `;
  });

  $('.table tbody').html(html);
  $('.balance-bonus__value').text(data.balance);
});