$.get('', data => {
  data = [
    {
      img: '../img/hotels/1.png',
      name: 'Отель Marriott Royal Aurora',
      geo: 'Москва, Россия',
      price: '10 300 руб.',
      stars: 10
    },
    {
      img: '../img/hotels/2.png',
      name: 'Отель Novotel',
      geo: 'Москва, Россия',
      price: '4 250 руб.',
      stars: 10
    },
    {
      img: '../img/hotels/3.png',
      name: 'Linda Resort Hotel',
      geo: 'Манавгат, Турция',
      price: '2 715 руб.',
      stars: 9
    },
  ];

  let html = '';
  data.forEach(hotel => {
    html += `
      <tr>
        <td>
          <div class="table__image-block">
            <img src="${hotel.img}" alt="${hotel.name}">
            <span>${hotel.name}</span>
          </div>
        </td>
        <td>${hotel.geo}</td>
        <td>
          <div class="stars">
            <img src="../img/icons/stars-${hotel.stars}.svg">
          </div>
        </td>
        <td class="nowrap">от ${hotel.price}</td>
      </tr>
    `;
  });

  $('.table tbody').html(html);
});