import Filter from './Filter';

export default class GetData {
  path = '';
  getAll() {
    this.user();
    this.booking();
    this.favourites();
    this.reviews();
    this.bonus();
  }
  user() {
    $.get(this.path + '', data => {
      data = {
        "name": "Иван", 
        "surname": "Иванов", 
        "second_name": "Иванович", 
        "email": "ivanovivan@gmail.ru",
        "date": "11.10.1992",
        "number": 79617910592,
        "change_password": "12.03.2023", 
        "image": "ссылка"
      };

      for (let name in data) {
        if (name == 'number') 
          $(`[name="${name}"]`).val($(`[name="${name}"]`).masked(data[name])); 
        else
          $(`[name="${name}"]`).val(data[name]);
      }
    });
  }
  booking() {
    $.get(this.path + '', data => {
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
  }
  favourites() {
    $.get(this.path + '', data => {
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
  }
  reviews() {
    $.get(this.path + '', data => {
      data = [
        {
          img: '../img/hotels/1.png',
          name: 'Отель Marriott Royal Aurora',
          geo: 'Москва, Россия',
          dates: '01.01.2023 - 10.01.2023',
          dateReview: '12.01.2023',
          stars: 8,
          avatar: '../img/reviews/1.png',
          author: 'Наталья',
          good: 'Расположение. Отзывчивый персонал.',
          bad: 'В номере были не убраны гигиенические средства, в частности ватные палочки предыдущих постояльцев. Поэтому остались некоторые вопросы по отношению к уборке и чистоте.'
        },
        {
          img: '../img/hotels/2.png',
          name: 'Отель Novotel',
          geo: 'Москва, Россия',
          dates: '01.01.2023 - 10.01.2023',
          dateReview: '12.01.2023',
          stars: 9,
          avatar: '../img/reviews/1.png',
          author: 'Наталья',
          good: 'Удобный матрас и подушки. Уютный лоби-бар. Приятный персонал.Хороший завтрак.Расположение супер. Жаль не удалось посетить спа-зону',
          bad: 'Не очень хорошая косметика и не было одноразового набора зубных щёток. Уставшая мебель. На завтраке не было шампанского'
        },
        {
          img: '../img/hotels/3.png',
          name: 'Linda Resort Hotel',
          geo: 'Москва, Россия',
          dates: '01.01.2023 - 10.01.2023',
          dateReview: '12.01.2023',
          stars: 10,
          avatar: '../img/reviews/1.png',
          author: 'Наталья',
          good: 'Удобный матрас и подушки. Уютный лоби-бар. Приятный персонал.Хороший завтрак.Расположение супер. Жаль не удалось посетить спа-зону',
          bad: 'Не очень хорошая косметика и не было одноразового набора зубных щёток. Уставшая мебель. На завтраке не было шампанского'
        },
        {
          img: '../img/hotels/1.png',
          name: 'Отель Marriott Royal Aurora',
          geo: 'Москва, Россия',
          dates: '01.01.2023 - 10.01.2023',
          dateReview: '12.01.2023',
          stars: 8,
          avatar: '../img/reviews/1.png',
          author: 'Наталья',
          good: 'Расположение. Отзывчивый персонал.',
          bad: 'В номере были не убраны гигиенические средства, в частности ватные палочки предыдущих постояльцев. Поэтому остались некоторые вопросы по отношению к уборке и чистоте.'
        },
      ];
    
      data.forEach(review => {
        let html = `
          <div class="reviews-card">
            <div class="reviews-card__header">
              <div class="reviews-card__dates">
                <div class="reviews-card__date-review">
                  <span class="reviews-card__date-title">Дата отзыва</span>
                  <span class="reviews-card__date-value">${review.dateReview}</span>
                </div>
                <div class="reviews-card__date-trip">
                  <span class="reviews-card__date-title">Дата поездки</span>
                  <span class="reviews-card__date-value">${review.dates}</span>
                </div>
              </div>
              <div class="reviews-card__stars">
                <img src="../img/icons/stars-${review.stars}.svg">
              </div>
            </div>
            <div class="reviews-card__hotel-info">
              <div class="reviews-card__img">
                <img src="${review.img}" alt="${review.name}">
              </div>
              <div>
                <div class="reviews-card__name">${review.name}</div>
                <div class="reviews-card__geo">${review.geo}</div>
              </div>
            </div>
            <div class="reviews-card__content">
              <div class="reviews-card__author">
                <div class="reviews-card__avatar">
                  <img src="${review.avatar}" alt="${review.author}">
                </div>
                <div class="reviews-card__author-name">${review.author}</div>
              </div>
              <div class="reviews-card__msg-title reviews-card__msg-title_good">Что было хорошо</div>
              <div class="reviews-card__msg-text">${review.good}</div>
              <div class="reviews-card__msg-title reviews-card__msg-title_bad">Что было плохо</div>
              <div class="reviews-card__msg-text">${review.bad}</div>
            </div>
          </div>
        `;
    
        let $col1 = $('.reviews__column').eq(0);
        let $col2 = $('.reviews__column').eq(1);
        let h1 = 0;
        $col1.find('> *').each((i, el) => h1 += $(el).outerHeight());
        let h2 = 0;
        $col2.find('> *').each((i, el) => h2 += $(el).outerHeight());
        if (h1 <= h2)
          $col1.append(html);
        else 
          $col2.append(html);
      });
    });
  }
  bonus() {
    $.get(this.path + '', data => {
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
  }
}