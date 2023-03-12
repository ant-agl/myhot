$.get('', data => {
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