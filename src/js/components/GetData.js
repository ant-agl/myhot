import Filter from "./Filter";
import ShowAll from "./ShowAll";
import { startLoad, endLoad } from "./load";
import moment from "moment";
moment.locale("ru");
moment.updateLocale("ru", {
  relativeTime: {
    s: "день",
    ss: "день",
    m: "день",
    mm: "день",
    h: "день",
    hh: "день",
  },
});

import RemoveRow from "./RemoveRow";
import insertColumn from "./insertColumn";
import {
  insertServices,
  insertRules,
  insertNearby,
  insertReviewsTotal,
  insertReviewsList,
  insertRooms,
} from "./insertDataHotel";

export default class GetData {
  path = ""; //https://wehotel.ru/php/

  getLk(obj = {}) {
    this.user(obj.user);
    this.booking();
    this.favourites();
    this.reviews();
    this.bonus();
  }
  getHotelsListPage() {
    this.filters();
    this.hotelsList();
  }
  user(birthday = false) {
    $.get(this.path + "", (data) => {
      data = {
        name: "Иван",
        surname: "Иванов",
        second_name: "Иванович",
        email: "ivanovivan@gmail.ru",
        date: "11.10.1992",
        number: 79617910592,
        change_password: "10.01.2023",
        image: "../img/photo.jpg",
        dfo: "mail",
      };

      for (let name in data) {
        let val = data[name];
        if (name == "number") val = $(`[name="${name}"]`).masked(val);

        if (name == "change_password") {
          let date = moment(val, "DD.MM.YYYY").fromNow();
          if (date == "день назад") date = "сегодня";
          val = "Был изменен " + date;
        }

        if (name == "image") {
          $(".main__photo-img").attr("src", val);
          continue;
        }

        if (name == "date" && birthday) {
          birthday.update({
            selectedDates: moment(val, "DD.MM.YYYY"),
          });
          continue;
        }

        $(`[name="${name}"]`).data("last-value", val).val(val);
      }
    });
  }
  booking() {
    $.get(this.path + "", (data) => {
      data = [
        {
          img: "../img/hotels/1.png",
          name: "Отель Marriott Royal Aurora",
          status: "active",
          geo: "Москва, Россия",
          dates: "01.01.2023 - 10.01.2023",
          peoplesAdult: 2,
          peoplesChild: 1,
          price: "10 000 руб.",
          fullPrice: "50 000 руб.",
        },
        {
          img: "../img/hotels/2.png",
          name: "Отель Novotel",
          status: "completed",
          geo: "Москва, Россия",
          dates: "01.01.2023 - 10.01.2023",
          peoplesAdult: 2,
          peoplesChild: 0,
          price: "10 000 руб.",
          fullPrice: "50 000 руб.",
        },
        {
          img: "../img/hotels/3.png",
          name: "Linda Resort Hotel",
          status: "fail",
          geo: "Манавгат, Турция",
          dates: "01.01.2023 - 10.01.2023",
          peoplesAdult: 1,
          peoplesChild: 2,
          price: "10 000 руб.",
          fullPrice: "50 000 руб.",
        },
      ];

      let html = "";
      data.forEach((hotel) => {
        let status = "";
        let statusClass = "";
        switch (hotel.status) {
          case "active":
            status = "Активен";
            statusClass = "value_active";
            break;
          case "completed":
            status = "Выполнен";
            statusClass = "value_completed";
            break;
          case "fail":
            status = "Отказ";
            statusClass = "value_fail";
            break;
        }

        let peoples = [];
        if (hotel.peoplesAdult == 1)
          peoples.push(hotel.peoplesAdult + " взрослый");
        else if (hotel.peoplesAdult > 1)
          peoples.push(hotel.peoplesAdult + " взрослых");

        if (hotel.peoplesChild == 1)
          peoples.push(hotel.peoplesChild + " ребенок");
        else if (hotel.peoplesChild > 1)
          peoples.push(hotel.peoplesChild + " ребенка");

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
                <span class="hotel-card__info-value">${peoples.join(
                  ",<br>"
                )}</span>
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

      $(".hotels").html(html);
      let filter = new Filter($(".filters"), $(".hotel-card"));
      filter.addExceptions("hotel-card_hidden");
    });
  }
  favourites() {
    $.get(this.path + "", (data) => {
      data = [
        {
          img: "../img/hotels/1.png",
          name: "Отель Marriott Royal Aurora",
          geo: "Москва, Россия",
          price: "10 300 руб.",
          stars: 10,
        },
        {
          img: "../img/hotels/2.png",
          name: "Отель Novotel",
          geo: "Москва, Россия",
          price: "4 250 руб.",
          stars: 10,
        },
        {
          img: "../img/hotels/3.png",
          name: "Linda Resort Hotel",
          geo: "Манавгат, Турция",
          price: "2 715 руб.",
          stars: 9,
        },
      ];

      let html = "";
      let htmlMobile = "";
      data.forEach((hotel) => {
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
              <div class="stars favourites-stars">
                <img src="../img/icons/stars/${hotel.stars}.png">
              </div>
            </td>
            <td>
              <span class="nowrap">от ${hotel.price}</span>
              <img src="../img/icons/cross.png" class="remove-favourites">
            </td>
          </tr>
        `;

        htmlMobile += `
          <div class="hotel-card">
            <div class="hotel-card__head">
              <div class="hotel-card__img">
                <img src="${hotel.img}" alt="${hotel.name}">
              </div>
              <div class="hotel-card__main-info">
                <div class="hotel-card__status">
                  <img src="../img/icons/cross.png" class="remove-favourites">
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
                <span class="hotel-card__info-title">Рейтинг</span>
                <span class="hotel-card__info-value">
                  <div class="stars favourites-stars">
                    <img src="../img/icons/stars/${hotel.stars}.png">
                  </div>
                </span>
              </div>
              <div class="hotel-card__info-row">
                <span class="hotel-card__info-title">Стоимость</span>
                <span class="hotel-card__info-value">${hotel.price}</span>
              </div>
            </div>
          </div>
        `;
      });

      $("#favourites .table tbody").html(html);
      $("#favourites .hotel-card_mobile").html(htmlMobile);

      new RemoveRow("tr, .hotel-card", ".remove-favourites");
    });
  }
  reviews() {
    $.get(this.path + "", (data) => {
      data = [
        {
          img: "../img/hotels/1.png",
          name: "Отель Marriott Royal Aurora",
          geo: "Москва, Россия",
          dates: "01.01.2023 - 10.01.2023",
          dateReview: "12.01.2023",
          stars: 8,
          avatar: "../img/reviews/1.png",
          author: "Наталья",
          good: "Расположение. Отзывчивый персонал.",
          bad: "В номере были не убраны гигиенические средства, в частности ватные палочки предыдущих постояльцев. Поэтому остались некоторые вопросы по отношению к уборке и чистоте.",
        },
        {
          img: "../img/hotels/2.png",
          name: "Отель Novotel",
          geo: "Москва, Россия",
          dates: "01.01.2023 - 10.01.2023",
          dateReview: "12.01.2023",
          stars: 9,
          avatar: "../img/reviews/1.png",
          author: "Наталья",
          good: "Удобный матрас и подушки. Уютный лоби-бар. Приятный персонал.Хороший завтрак.Расположение супер. Жаль не удалось посетить спа-зону",
          bad: "Не очень хорошая косметика и не было одноразового набора зубных щёток. Уставшая мебель. На завтраке не было шампанского",
        },
        {
          img: "../img/hotels/3.png",
          name: "Linda Resort Hotel",
          geo: "Москва, Россия",
          dates: "01.01.2023 - 10.01.2023",
          dateReview: "12.01.2023",
          stars: 10,
          avatar: "../img/reviews/1.png",
          author: "Наталья",
          good: "Удобный матрас и подушки. Уютный лоби-бар. Приятный персонал.Хороший завтрак.Расположение супер. Жаль не удалось посетить спа-зону",
          bad: "Не очень хорошая косметика и не было одноразового набора зубных щёток. Уставшая мебель. На завтраке не было шампанского",
        },
        {
          img: "../img/hotels/1.png",
          name: "Отель Marriott Royal Aurora",
          geo: "Москва, Россия",
          dates: "01.01.2023 - 10.01.2023",
          dateReview: "12.01.2023",
          stars: 6,
          avatar: "../img/reviews/1.png",
          author: "Наталья",
          good: "Расположение. Отзывчивый персонал.",
          bad: "В номере были не убраны гигиенические средства, в частности ватные палочки предыдущих постояльцев. Поэтому остались некоторые вопросы по отношению к уборке и чистоте.",
        },
      ];

      data.forEach((review) => {
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
                <img src="../img/icons/stars/${review.stars}.png">
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

        let $col1 = $(".reviews__column").eq(0);
        let $col2 = $(".reviews__column").eq(1);
        insertColumn($col1, $col2, html);
      });
    });
  }
  bonus() {
    $.get(this.path + "", (data) => {
      data = {
        balance: 345,
        hotels: [
          {
            img: "../img/hotels/1.png",
            name: "Отель Marriott Royal Aurora",
            geo: "Москва, Россия",
            price: "20 300 руб.",
            bonus: 100,
          },
          {
            img: "../img/hotels/2.png",
            name: "Отель Novotel",
            geo: "Москва, Россия",
            price: "10 500 руб.",
            bonus: 200,
          },
          {
            img: "../img/hotels/3.png",
            name: "Linda Resort Hotel",
            geo: "Манавгат, Турция",
            price: "5 400 руб.",
            bonus: -250,
          },
        ],
      };

      let html = "";
      let htmlMobile = "";
      data.hotels.forEach((hotel) => {
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
              <span class="${
                hotel.bonus >= 0 ? "bonus_positive" : "bonus_negative"
              }">
                ${hotel.bonus >= 0 ? "+" : ""}${hotel.bonus}
              </span>
            </td>
          </tr>
        `;

        htmlMobile += `
          <div class="hotel-card">
            <div class="hotel-card__head">
              <div class="hotel-card__img">
                <img src="${hotel.img}" alt="${hotel.name}">
              </div>
              <div class="hotel-card__main-info">
                <div class="hotel-card__status"></div>
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
                <span class="hotel-card__info-title">Стоимость</span>
                <span class="hotel-card__info-value">${hotel.price}</span>
              </div>
              <div class="hotel-card__info-row">
                <span class="hotel-card__info-title">Количество бонусов</span>
                <span class="hotel-card__info-value">
                  <span class="${
                    hotel.bonus >= 0 ? "bonus_positive" : "bonus_negative"
                  }">
                    ${hotel.bonus >= 0 ? "+" : ""}${hotel.bonus}
                  </span>
                </span>
              </div>
            </div>
          </div>
        `;
      });

      $("#bonus .table tbody").html(html);
      $("#bonus .hotel-card_mobile").html(htmlMobile);
      $(".balance-bonus__value").text(data.balance);
    });
  }
  filters() {
    //data_filter.php
    // $.get(this.path + "", (data) => {
    $.get("https://wehotel.ru/php/data_filter.php", (data) => {
      data.forEach((filter) => {
        let nameArr = filter.name.split("_");
        let name = "";
        if (nameArr.length > 1) {
          name = nameArr[1];
        } else {
          name = nameArr[0];
        }

        let htmlData = "";
        let type = filter.type == "radio" ? "radio" : "checkbox";
        filter.data.forEach((item) => {
          htmlData += `
            <label class="filter__row">
              <input type="${type}" name="${name}" value="${item}">
              <span>${item}</span>
            </label>
          `;
        });

        let html = `
          <div class="filter__title">${name}</div>
          <div class="filter__body filter__body_overflow" id="filter-content-${filter.id}">
            ${htmlData}
          </div>
          <div class="filter__show-all link-underline" id="filter-btn-${filter.id}" data-target="filter-content-${filter.id}">Показать все</div>
        `;

        if (nameArr.length > 1) {
          if ($(`[data-name="${nameArr[0]}"]`).length == 0) {
            $(".filters").append(`
              <div class="filter filter_box" data-name="${nameArr[0]}">
                <div class="filter__title">${nameArr[0]}</div>
                <div class="filter__body"></div>
              </div>
            `);
          }
          $(`[data-name="${nameArr[0]}"] > .filter__body`).append(`
            <hr class="filter__hr">
            ${html}
          `);
        } else {
          $(".filters").append(`
            <div class="filter filter_box">
              ${html}
            </div>
          `);
        }

        new ShowAll(`filter-btn-${filter.id}`);
      });
    });
  }
  hotelsList(query = "") {
    startLoad($(".hotels-list"));
    setTimeout(() => {
      $.get(this.path + "" + query, (data) => {
        data = [
          {
            img: "../img/hotels/1.png",
            stars: 10,
            name: "Отель Marriott Royal Aurora",
            isHeart: true,
            geo: "Москва, ул. Николоямская, д. 83/33",
            metro: "Марксистская",
            train: "Белорусский 2км",
            plane: "Шереметьево",
            estimation: 9.8,
            price: "6 385",
            link: "#",
          },
          {
            img: "../img/hotels/1.png",
            stars: 8,
            name: "Отель Marriott Royal Aurora",
            isHeart: false,
            geo: "Москва, ул. Николоямская, д. 83/33",
            metro: "Марксистская",
            train: "Белорусский 2км",
            plane: "Шереметьево",
            estimation: 9.0,
            price: "120 500",
            link: "#",
          },
          {
            img: "../img/hotels/1.png",
            stars: 10,
            name: "Отель Marriott Royal Aurora",
            isHeart: false,
            geo: "Москва, ул. Николоямская, д. 83/33",
            metro: "Марксистская",
            train: "Белорусский 2км",
            plane: "Шереметьево",
            estimation: 9.8,
            price: "1 229 385",
            link: "#",
          },
        ];

        let html = "";
        data.forEach((hotel) => {
          let fzPrice = false;
          if (hotel.price.length > 7) fzPrice = 15;
          else if (hotel.price.length == 7) fzPrice = 17;
          let stylePrice = "";
          if (fzPrice) stylePrice = `font-size:${fzPrice}px`;

          html += `
            <div class="hotel-card">
              <div class="hotel-card__img">
                <div class="hotel-card__img-filter">
                  <img src="${hotel.img}" alt="${hotel.name}">
                </div>
                <img src="../img/icons/stars/${
                  hotel.stars
                }.png" class="hotel-card__img-stars">
                <svg class="hotel-card__img-heart ${
                  hotel.isHeart ? "active" : ""
                }" width="16" height="14" viewBox="0 0 16 14" fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M8.34984 10.8654L13.0377 6.21726C14.1894 5.06956 14.3572 3.19308 13.2692 1.99373C12.9963 1.69149 12.6642 1.44759 12.293 1.27693C11.9219 1.10627 11.5195 1.01243 11.1106 1.00115C10.7016 0.989875 10.2946 1.06139 9.9145 1.21133C9.53436 1.36127 9.18904 1.58649 8.89965 1.87323L8.01995 2.75121L7.2618 1.99373C6.1043 0.851775 4.2118 0.685359 3.00222 1.76419C2.6974 2.03476 2.45141 2.3641 2.27929 2.7321C2.10718 3.10011 2.01254 3.49905 2.00116 3.90454C1.98979 4.31003 2.06192 4.71357 2.21314 5.09049C2.36436 5.46741 2.5915 5.80981 2.88068 6.09675L7.69007 10.8654C7.77785 10.9516 7.8964 11 8.01995 11C8.1435 11 8.26206 10.9516 8.34984 10.8654Z"
                    stroke="white"/>
                </svg>
              </div>
              <div class="hotel-card__main">
                <div class="hotel-card__title">${hotel.name}</div>
                <div class="hotel-card__row-info">
                  <img src="../img/icons/geo.svg">
                  <span>${hotel.geo}</span>
                </div>
                <div class="hotel-card__row-info">
                  <img src="../img/icons/metro.svg">
                  <span>${hotel.metro}</span>
                </div>
                <div class="hotel-card__row-info">
                  <img src="../img/icons/train.svg">
                  <span>${hotel.train}</span>
                </div>
                <div class="hotel-card__row-info">
                  <img src="../img/icons/plane.svg">
                  <span>${hotel.plane}</span>
                </div>
                <div class="hotel-card__row-info">
                  <span class="hotel-card__estimation">${
                    hotel.estimation
                  }</span>
                  <span>по оценкам гостей</span>
                </div>
              </div>
              <div class="hotel-card__footer">
                <span class="hotel-card__price">
                  от <span class="hotel-card__price-value" style="${stylePrice}">${
            hotel.price
          }</span>
                  <span class="hotel-card__price-ruble">&#8381;</span>
                </span>
                <a href="${hotel.link}" class="btn">Подробнее</a>
              </div>
            </div>
          `;
        });
        html += '<div class="hotel-card hotel-card_hidden"></div>';
        html += '<div class="hotel-card hotel-card_hidden"></div>';
        $(".hotels-list").html(html);
      });
      endLoad($(".hotels-list"));
    }, 2000);
  }
  hotel(id = "") {
    $.get(this.path + "" + id, (data) => {
      data = {
        services: {
          free: [
            {
              name: "Общее",
              list: [
                "Банкомат",
                "Круглосуточная стойка регистрации",
                "Лифт",
                "Магазины",
                "Обмен валюты",
                "Отель для некурящих",
                "Охрана",
                "Поздняя регистрация выезда",
                "Пресса",
                "Ранняя регистрация заезда",
                "Сувенирный магазин",
                "Терраса",
                "Ускоренная регистрация заезда и выезда",
              ],
            },
            {
              name: "В номерах",
              list: [
                "Кабельное телевидение",
                "Люкс для новобрачных",
                "Мини-бар",
                "Номера для некурящих",
                "Номера со звукоизоляцией",
                "Обслуживание номеров",
                "Сейф (в номере)",
                "Семейные номера",
                "Телевизор",
                "Халат",
              ],
            },
            {
              name: "Дети",
              list: ["Размещение подходит для семей/детей"],
            },
          ],
          paid: [
            {
              name: "Услуги и удобства",
              list: [
                {
                  name: "Гладильные услуги",
                  price: "500 руб.",
                },
                {
                  name: "Прачечная",
                  price: "500 руб.",
                },
                {
                  name: "Химчистка",
                  price: "500 руб.",
                },
                {
                  name: "Чистка обуви",
                  price: "500 руб.",
                },
              ],
            },
            {
              name: "Красота и здоровье",
              list: [
                {
                  name: "Массаж",
                  price: "1 200 руб.",
                },
                {
                  name: "Салон красоты",
                  price: "1 600 руб.",
                },
                {
                  name: "Спа-центр",
                  price: "2 000 руб.",
                },
              ],
            },
          ],
        },
        rules: [
          "Какое-то правило, которое нельзя делать в отеле.",
          "Какое-то правило, которое нельзя делать в отеле.",
          "Какое-то правило, которое нельзя делать в отеле.",
          "Какое-то правило, которое нельзя делать в отеле.",
          "Какое-то правило, которое нельзя делать в отеле.",
        ],
        nearby: [
          {
            name: "Достопримечательности",
            list: [
              {
                name: "Собор Василия Блаженова",
                distance: "2.3 км",
              },
              {
                name: "Московский Кремль",
                distance: "2.3 км",
              },
              {
                name: "Государственная Третьяковская галерея",
                distance: "2.3 км",
              },
              {
                name: "Парк Горького",
                distance: "2.3 км",
              },
              {
                name: "Москва-Сити",
                distance: "2.3 км",
              },
              {
                name: "ВДНХ",
                distance: "2.3 км",
              },
            ],
          },
          {
            name: "Аэропорт",
            list: [
              {
                name: "Шереметьево",
                distance: "2.3 км",
              },
              {
                name: "Внуково",
                distance: "2.3 км",
              },
              {
                name: "Жуковский",
                distance: "2.3 км",
              },
              {
                name: "Домодедово",
                distance: "2.3 км",
              },
            ],
          },
          {
            name: "Метро",
            list: [
              {
                name: "Маяковская",
                distance: "260 м",
              },
              {
                name: "Пушкинская",
                distance: "460 м",
              },
              {
                name: "Тверская",
                distance: "570 м",
              },
            ],
          },
        ],
        reviews: {
          total: {
            estimation: 8.9,
            clear: 8.5,
            hygiene: 7.3,
            location: 9.9,
            food: 7.5,
            price: 8.3,
            number: 7.8,
            service: 8.5,
            wifi: 9.7,
          },
          list: [
            {
              dateReview: "12.01.2023",
              dateTrip: "01.01.2023 - 10.01.2023",
              img: "../img/hotels/1.png",
              nameRoom: "Двухместный номер Executive",
              estimation: 8.4,
              clear: 8,
              hygiene: 7,
              location: 10,
              food: 7,
              price: 8,
              number: 7,
              service: 8,
              wifi: 9,
              avatar: "../img/reviews/1.png",
              name: "Наталья",
              textGood:
                "Понравилось все. Не первый раз тут останавливаюсь.Понравилось все. Не первый раз тут останавливаюсь.Понравилось все. Не первый раз тут останавливаюсь.Понравилось все. Не первый раз тут останавливаюсь.Понравилось все. Не первый раз тут останавливаюсь.Понравилось все. Не первый раз тут останавливаюсь.Понравилось все. Не первый раз тут останавливаюсь.Понравилось все. Не первый раз тут останавливаюсь.Понравилось все. Не первый раз тут останавливаюсь.Понравилось все. Не первый раз тут останавливаюсь.Понравилось все. Не первый раз тут останавливаюсь.Понравилось все. Не первый раз тут останавливаюсь.Понравилось все. Не первый раз тут останавливаюсь.Понравилось все. Не первый раз тут останавливаюсь.Понравилось все. Не первый раз тут останавливаюсь.Понравилось все. Не первый раз тут останавливаюсь.Понравилось все. Не первый раз тут останавливаюсь.Понравилось все. Не первый раз тут останавливаюсь.Понравилось все. Не первый раз тут останавливаюсь.Понравилось все. Не первый раз тут останавливаюсь.Понравилось все. Не первый раз тут останавливаюсь.Понравилось все. Не первый раз тут останавливаюсь.Понравилось все. Не первый раз тут останавливаюсь.Понравилось все. Не первый раз тут останавливаюсь.Понравилось все. Не первый раз тут останавливаюсь.Понравилось все. Не первый раз тут останавливаюсь.Понравилось все. Не первый раз тут останавливаюсь.Понравилось все. Не первый раз тут останавливаюсь.Понравилось все. Не первый раз тут останавливаюсь.Понравилось все. Не первый раз тут останавливаюсь.Понравилось все. Не первый раз тут останавливаюсь.Понравилось все. Не первый раз тут останавливаюсь.Понравилось все. Не первый раз тут останавливаюсь.Понравилось все. Не первый раз тут останавливаюсь.Понравилось все. Не первый раз тут останавливаюсь.Понравилось все. Не первый раз тут останавливаюсь.Понравилось все. Не первый раз тут останавливаюсь.Понравилось все. Не первый раз тут останавливаюсь.Понравилось все. Не первый раз тут останавливаюсь.Понравилось все. Не первый раз тут останавливаюсь.Понравилось все. Не первый раз тут останавливаюсь.Понравилось все. Не первый раз тут останавливаюсь.Понравилось все. Не первый раз тут останавливаюсь.Понравилось все. Не первый раз тут останавливаюсь.",
              textBad: "Нет",
            },
            {
              dateReview: "12.01.2023",
              dateTrip: "01.01.2023 - 10.01.2023",
              img: "../img/hotels/1.png",
              nameRoom: "Двухместный номер Executive",
              estimation: 6.4,
              clear: 8,
              hygiene: 7,
              location: 10,
              food: 5,
              price: 8,
              number: 7,
              service: 1,
              wifi: 9,
              avatar: "../img/reviews/1.png",
              name: "Наталья",
              textGood: "Понравилось все. Не первый раз тут останавливаюсь.",
              textBad: "Нет",
            },
            {
              dateReview: "12.01.2023",
              dateTrip: "01.01.2023 - 10.01.2023",
              img: "../img/hotels/1.png",
              nameRoom: "Двухместный номер Executive",
              estimation: 4.3,
              clear: 8,
              hygiene: 7,
              location: 10,
              food: 7,
              price: 4,
              number: 5,
              service: 7,
              wifi: 9,
              avatar: "../img/reviews/1.png",
              name: "Наталья",
              textGood: "Понравилось все. Не первый раз тут останавливаюсь.",
              textBad: "Нет",
            },
          ],
        },
        rooms: [
          {
            name: "Двухместный номер Deluxe",
            images: [
              "../img/rooms/1.png",
              "../img/rooms/2.png",
              "../img/rooms/3.png",
            ],
            list: [
              "Двуспальная кровать",
              "Питание не включено",
              "Кровать размера «king size»",
              "Окно",
              "Двуспальная кровать",
              "Питание не включено",
              "Кровать размера «king size»",
              "Окно",
            ],
            price: "9 000",
          },
          {
            name: "Двухместный номер Deluxe",
            images: [
              "../img/rooms/1.png",
              "../img/rooms/2.png",
              "../img/rooms/3.png",
            ],
            list: [
              "Двуспальная кровать",
              "Питание не включено",
              "Кровать размера «king size»",
              "Окно",
            ],
            price: "9 000",
          },
        ],
      };

      insertServices(data.services);
      insertRules(data.rules);
      insertNearby(data.nearby);
      insertReviewsTotal(data.reviews.total);
      insertReviewsList(data.reviews.list);
      insertRooms(data.rooms);
    });
  }
}
