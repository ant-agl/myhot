import { data2get } from "./data2get";
import BackgroundImage from "./BackgroundImage";
import Filter from "./Filter";
import ShowAll from "./ShowAll";
import { startLoad, endLoad } from "./load";
import MapApi from "./MapApi";
import moment from "moment";
import getColor from "./getColor";
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
  insertHotel,
  insertServices,
  insertRules,
  insertNearby,
  insertReviewsTotal,
  insertReviewsList,
  insertRooms,
} from "./insertDataHotel";

export default class GetData {
  path = "https://wehotel.ru/handler/";
  path_php = "https://wehotel.ru/php/";

  getLk(obj = {}) {
    this.user(obj.user);
    this.statuses();
    this.favourites();
    this.bonus();
  }
  getHotelsListPage(getData) {
    this.filters();
    this.hotelsList(getData);
  }
  user(birthday = false) {
    $.get(this.path + "get_data.php", (data) => {
      data = JSON.parse(data);
      console.log(data);

      if (!data.email_confirm) {
        $(".email-hint").removeClass("input-hint__not-active");
      }
      if (!data.img_id) data.img_id = "../img/no-photo.jpg";
      for (let name in data) {
        let val = data[name];
        if (name == "phone") val = $(`[name="${name}"]`).masked(val);

        if (name == "change_pass") {
          let date = moment(val * 1000).fromNow();
          if (date == "день назад") date = "сегодня";
          val = "Был изменен " + date;
        }

        if (name == "img_id") {
          $(".main__photo-img").attr("src", val);
          continue;
        }

        if (name == "birthday" && birthday) {
          val *= 1000;
          birthday.update({
            selectedDates: val,
          });
          $(`[name="${name}"]`).data(
            "last-value",
            moment(val).format("DD.MM.YYYY")
          );
          continue;
        }

        $(`[name="${name}"]`).data("last-value", val).val(val);
      }
      this.reviews(data);
    });
  }
  statuses() {
    $.get(this.path_php + "data_status.php", (data) => {
      console.log(data);

      data.forEach((filter) => {
        let html = "";
        html += `<button class="main__button filter-btn" data-filter="${filter.id}">${filter.name}</button>`;
        $(".booking-filters").append(html);
      });

      this.booking(data);
    });
  }
  booking(filters = []) {
    $.get(this.path + "get_reserve.php", (data) => {
      data = JSON.parse(data);
      console.log(data);

      let html = "";
      data.forEach((hotel) => {
        let dates = `${moment(hotel.input_date * 1000).format(
          "DD.MM.YYYY"
        )} - `;
        dates += `${moment(hotel.output_date * 1000).format("DD.MM.YYYY")}`;

        let filter = filters.find((f) => f.id == hotel.status);
        let status = filter.nick ?? filter.name;
        let statusColor = filter.color ?? "#000";

        let peoples = [];
        if (hotel.number_of_adults == 1)
          peoples.push(hotel.number_of_adults + " взрослый");
        else if (hotel.number_of_adults > 1)
          peoples.push(hotel.number_of_adults + " взрослых");

        if (hotel.count_of_kids == 1)
          peoples.push(hotel.count_of_kids + " ребенок");
        else if (hotel.count_of_kids > 1)
          peoples.push(hotel.count_of_kids + " ребенка");

        let peoplesText =
          peoples.length > 0 ? peoples.join(",<br>") : "&mdash;";

        let geo =
          hotel.joined_hotel_search[0].city +
          ", " +
          hotel.joined_hotel_search[0].country;

        let image = hotel.joined_hotel_search[0].image ?? "../img/empty.png";
        let price = hotel.cost_per_night
          ? hotel.cost_per_night?.toLocaleString() + " руб."
          : "&mdash;";
        let fullPrice = hotel.cost_full
          ? hotel.cost_full?.toLocaleString() + " руб."
          : "&mdash;";

        html += `
          <div class="hotel-card" data-filter-item="${hotel.status}">
            <div class="hotel-card__head">
              <div class="hotel-card__img">
                <img src="${image}" alt="${hotel.joined_hotel_search[0].name}">
              </div>
              <div class="hotel-card__main-info">
                <div class="hotel-card__status">
                  <span>Статус</span>
                  <span class="value hint">
                    <span style="color:${statusColor}">${status}</span>
                    <div class="hint__text hint__text_right">${
                      filter.name
                    }</div>
                  </span>
                </div>
                <div class="hotel-card__name">
                  ${hotel.joined_hotel_search[0].name}
                </div>
                <div class="hotel-card__geo">
                  ${geo}
                </div>
              </div>
            </div>
            <div class="hotel-card__info">
              <div class="hotel-card__info-row">
                <span class="hotel-card__info-title">Дата бронирования</span>
                <span class="hotel-card__info-value">${dates}</span>
              </div>
              <div class="hotel-card__info-row">
                <span class="hotel-card__info-title">Количество человек</span>
                <span class="hotel-card__info-value">${peoplesText}</span>
              </div>
              <div class="hotel-card__info-row">
                <span class="hotel-card__info-value">${
                  hotel.joined_rooms_search?.[0]?.name ?? ""
                }</span>
              </div>
              <div class="hotel-card__info-row">
                <span class="hotel-card__info-title">Стоимость за номер</span>
                <span class="hotel-card__info-value">${price}</span>
              </div>
              <div class="hotel-card__info-row">
                <span class="hotel-card__info-title">Общая стоимость</span>
                <span class="hotel-card__info-value">${fullPrice}</span>
              </div>
            </div>
          </div>
        `;
      });
      if (data.length % 2 != 0)
        html += '<div class="hotel-card hotel-card_hidden"></div>';

      $(".hotels").html(html);
      let filter = new Filter($(".filters"), $(".booking-hotels .hotel-card"));
      filter.addExceptions("hotel-card_hidden");
    });
  }
  favourites() {
    $.get(this.path + "get_favourites.php", (data) => {
      data = JSON.parse(data);
      console.log(data);

      let html = "";
      let htmlMobile = "";
      data.forEach((hotel) => {
        let geo = hotel.joined_hotel_search[0].city + ", ";
        geo += hotel.joined_hotel_search[0].country;

        if (!hotel.joined_hotel_search[0].image)
          hotel.joined_hotel_search[0].image = "../img/empty.png";

        html += `
          <tr>
            <td>
              <div class="table__image-block">
                <img src="${hotel.joined_hotel_search[0].image}" alt="${
          hotel.joined_hotel_search[0].name
        }">
                <span>${hotel.joined_hotel_search[0].name}</span>
              </div>
            </td>
            <td>${geo}</td>
            <td>
              <div class="stars favourites-stars">
                <img src="../img/icons/stars/${
                  hotel.joined_hotel_search[0].rating.stars
                }.png">
              </div>
            </td>
            <td>
              <span class="nowrap">от ${
                hotel.joined_hotel_search[0].price?.toLocaleString() ?? "??"
              } руб.</span>
              <img src="../img/icons/cross.png" class="remove-favourites" data-id="${
                hotel.hotel_id
              }">
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

      new RemoveRow("tr, .hotel-card", ".remove-favourites", {
        id: "hotel_id",
        path: this.path + "delete_favourites.php",
      });
    });
  }
  reviews(userData = {}) {
    $.get(this.path + "get_reviews.php", (data) => {
      data = JSON.parse(data);
      console.log(data);

      data.forEach((review) => {
        let dates =
          moment(review.joined_reserve[0].input_date * 1000).format(
            "DD.MM.YYYY"
          ) + " - ";
        dates += moment(review.joined_reserve[0].output_date * 1000).format(
          "DD.MM.YYYY"
        );

        let geo = review.joined_hotel_search[0].city + ", ";
        geo += review.joined_hotel_search[0].country;
        let html = `
          <div class="reviews-card">
            <div class="reviews-card__header">
              <div class="reviews-card__dates">
                <div class="reviews-card__date-review">
                  <span class="reviews-card__date-title">Дата отзыва:</span>
                  <span class="reviews-card__date-value">${moment(
                    review.date * 1000
                  ).format("DD.MM.YYYY")}</span>
                </div>
                <div class="reviews-card__date-trip">
                  <span class="reviews-card__date-title">Дата поездки:</span>
                  <span class="reviews-card__date-value">${dates}</span>
                </div>
              </div>
              <div class="reviews-card__estimation ${getColor(
                review.rating
              )}">${review.rating}</div>
            </div>
            <div class="reviews-card__hotel-info">
              <div class="reviews-card__img">
                <img src="${review.joined_hotel_search[0].image}" alt="${
          review.joined_hotel_search[0].name
        }">
              </div>
              <div>
                <div class="reviews-card__stars">
                  <img src="../img/icons/stars/${
                    review.joined_hotel_search[0].rating.stars
                  }.png">
                </div>
                <div class="reviews-card__name">${
                  review.joined_hotel_search[0].name
                }</div>
                <div class="reviews-card__geo">${geo}</div>
              </div>
            </div>
            <div class="reviews-card__content">
              <div class="reviews-card__author">
                <div class="reviews-card__avatar">
                  <img src="${userData.img_id}" alt="${userData.name}">
                </div>
                <div class="reviews-card__author-name">${userData.name}</div>
              </div>
              <div class="reviews-card__msg-title reviews-card__msg-title_good">Что было хорошо</div>
              <div class="reviews-card__msg-text">${review.opinion.well}</div>
              <div class="reviews-card__msg-title reviews-card__msg-title_bad">Что было плохо</div>
              <div class="reviews-card__msg-text">${review.opinion.badly}</div>
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
    $.get(this.path + "bonus_program.php", (data) => {
      data = JSON.parse(data);
      console.log("bonus", data);
      // data = {
      //   balance: 345,
      //   hotels: [
      //     {
      //       img: "../img/hotels/1.png",
      //       name: "Отель Marriott Royal Aurora",
      //       geo: "Москва, Россия",
      //       price: "20 300 руб.",
      //       bonus: 100,
      //       fromDate: "11.10.2022",
      //       toDate: "18.10.2022",
      //     },
      //     {
      //       img: "../img/hotels/2.png",
      //       name: "Отель Novotel",
      //       geo: "Москва, Россия",
      //       price: "10 500 руб.",
      //       bonus: 200,
      //       fromDate: "11.10.2022",
      //       toDate: "18.10.2022",
      //     },
      //     {
      //       img: "../img/hotels/3.png",
      //       name: "Linda Resort Hotel",
      //       geo: "Манавгат, Турция",
      //       price: "5 400 руб.",
      //       bonus: -250,
      //       fromDate: "11.10.2022",
      //       toDate: "18.10.2022",
      //     },
      //   ],
      // };

      let html = "";
      let htmlMobile = "";
      data.history.forEach((hotel) => {
        if (!hotel.joined_hotel_search[0].image)
          hotel.joined_hotel_search[0].image = "../img/empty.png";

        let geo = hotel.joined_hotel_search[0].city + ", ";
        geo += hotel.joined_hotel_search[0].country;

        let price = "&mdash;";
        if (hotel.cost_full) {
          price = hotel.cost_full.toLocaleString() + " руб.";
        }

        html += `
          <tr>
            <td>
              <div class="table__image-block">
                <img src="${hotel.joined_hotel_search[0].image}" alt="${
          hotel.joined_hotel_search[0].name
        }">
                <span>${hotel.joined_hotel_search[0].name}</span>
              </div>
            </td>
            <td>${geo}</td>
            <td class="nowrap">${price}</td>
            <td>
              <span class="${
                hotel.bonus >= 0 ? "bonus_positive" : "bonus_negative"
              }">
                ${hotel.bonus >= 0 ? "+" : ""}${hotel.bonus}
              </span>
            </td>
            <td class="table-dates">
              <span class="nowrap"><span class="bonus-table__date-desc">От</span> ${moment(
                hotel.input_date * 1000
              ).format("DD.MM.YYYY")}</span>
              <span class="nowrap"><span class="bonus-table__date-desc">До</span> ${moment(
                hotel.output_date * 1000
              ).format("DD.MM.YYYY")}</span>
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
              <div class="hotel-card__info-row">
                <span class="hotel-card__info-title">Даты</span>
                <span class="hotel-card__info-value">${hotel.fromDate} - ${
          hotel.toDate
        }</span>
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
    $.get(this.path_php + "data_filter.php", (data) => {
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
  getAllFavourites() {
    return new Promise((resolve) => {
      $.get(this.path + "get_all_favourites.php", (data) => {
        data = JSON.parse(data);
        console.log(data);
        resolve(data);
      });
    });
  }
  hotelsList(getData = {}) {
    let search = data2get(getData);
    let coords = [];

    let myMap = new MapApi();

    if (!search) {
      this._notFoundHotels();
      return;
    }
    startLoad($(".hotels-list"));
    $.get(this.path_php + "search/search.php" + search, (data) => {
      console.log(data);

      let html = "";
      data.forEach((hotel) => {
        if (hotel.position?.coordinate) {
          let image = "";
          if (hotel.image) {
            image = `<img src="${hotel.image}" style="width:100px;">`;
          }
          coords.push({
            coords: hotel.position?.coordinate,
            name: hotel.name,
            image,
            id: hotel.id,
          });
        }

        let fzPrice = false;
        hotel.price = hotel.price?.toLocaleString() ?? "0";
        if (hotel.price.length > 7) fzPrice = 15;
        else if (hotel.price.length == 7) fzPrice = 17;
        let stylePrice = "";
        if (fzPrice) stylePrice = `font-size:${fzPrice}px`;

        if (!hotel.image) hotel.image = "../img/empty.png";

        html += `
          <div class="hotel-card" data-id="${hotel.id}">
            <div class="hotel-card__img">
              <div class="hotel-card__img-filter" data-url="${
                hotel.image
              }"></div>
              <svg class="hotel-card__img-heart" width="16" height="14" viewBox="0 0 16 14" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M8.34984 10.8654L13.0377 6.21726C14.1894 5.06956 14.3572 3.19308 13.2692 1.99373C12.9963 1.69149 12.6642 1.44759 12.293 1.27693C11.9219 1.10627 11.5195 1.01243 11.1106 1.00115C10.7016 0.989875 10.2946 1.06139 9.9145 1.21133C9.53436 1.36127 9.18904 1.58649 8.89965 1.87323L8.01995 2.75121L7.2618 1.99373C6.1043 0.851775 4.2118 0.685359 3.00222 1.76419C2.6974 2.03476 2.45141 2.3641 2.27929 2.7321C2.10718 3.10011 2.01254 3.49905 2.00116 3.90454C1.98979 4.31003 2.06192 4.71357 2.21314 5.09049C2.36436 5.46741 2.5915 5.80981 2.88068 6.09675L7.69007 10.8654C7.77785 10.9516 7.8964 11 8.01995 11C8.1435 11 8.26206 10.9516 8.34984 10.8654Z"
                  stroke="white"/>
              </svg>
            </div>
            <div class="hotel-card__main">
              <img src="../img/icons/stars/${
                hotel.rating.stars
              }.png" class="hotel-card__img-stars">
              <div class="hotel-card__title">${hotel.name}</div>
              <div class="hotel-card__row-info">
                <img src="../img/icons/geo.svg">
                <span>От центра ${hotel.position.center} км</span>
              </div>
              <div class="hotel-card__row-info">
                <img src="../img/icons/metro.svg">
                <span>От метро ${hotel.position.metro} км</span>
              </div>
              <div class="hotel-card__row-info">
                <img src="../img/icons/sea.svg">
                <span>От моря ${hotel.position.sea} км</span>
              </div>
              <div class="hotel-card__row-info">
                <img src="../img/icons/train.svg">
                <span>От вокзала ${hotel.train ?? "??"} км</span>
              </div>
              <div class="hotel-card__row-info">
                <img src="../img/icons/plane.svg">
                <span>От аэропорта ${hotel.plane ?? "??"} км</span>
              </div>
              <div class="hotel-card__row-info">
                <span class="hotel-card__estimation color_${getColor(
                  hotel.rating.reviews
                )}">${hotel.rating.reviews}</span>
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
              <a href="../hotel?id=${hotel.id}" class="btn">Подробнее</a>
            </div>
          </div>
        `;
      });
      if (html == "") {
        this._notFoundHotels();
        return;
      }
      html += '<div class="hotel-card hotel-card_hidden"></div>';
      html += '<div class="hotel-card hotel-card_hidden"></div>';
      html += '<div class="hotel-card hotel-card_hidden"></div>';
      $(".hotels-list").html(html);
      new BackgroundImage(".hotel-card__img-filter", {
        paddingBottom: "73%",
        size: "cover",
      });

      myMap.addPointsReady(coords);
      $(".btn-open-map").on("click", function () {
        let time = 0;
        let t = setInterval(() => {
          myMap.resizeMap();
          time += 10;
          if (time > 500) clearInterval(t);
        }, 10);
      });

      this.getAllFavourites().then((data) => {
        data.forEach((id) => {
          $(`.hotel-card[data-id="${id}"] .hotel-card__img-heart`).addClass(
            "active"
          );
        });
      });
      endLoad($(".hotels-list"));
    });
  }
  _notFoundHotels() {
    $(".hotels-list").html(
      '<span style="color: #fff;background:#21527d;">Ничего не найдено</span>'
    );
  }
  hotel(id = "") {
    $.get(this.path_php + "data_hotel.php?id_hotel=" + id, (data) => {
      data = JSON.parse(data);
      console.log(data);
      insertHotel(data);

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

      insertRooms(data.rooms);
    });
    $.get(this.path + "get_all_services.php?id_hotel=" + id, (allService) => {
      allService = JSON.parse(allService);
      $.get(this.path_php + "get_services.php?id_hotel=" + id, (data) => {
        data = JSON.parse(data);
        console.log(data);
        insertServices(data, allService);
      });
    });
    $.get(this.path_php + "avg_reviews.php?id_hotel=" + id, (data) => {
      data = JSON.parse(data);
      console.log(data);
      insertReviewsTotal(data);
    });
    $.get(this.path_php + "data_reviews.php?id_hotel=" + id, (data) => {
      data = JSON.parse(data);
      console.log(data);
      insertReviewsList(data);
    });
    $.get(this.path_php + "get_attractions.php?id_hotel=" + id, (data) => {
      data = JSON.parse(data);
      console.log(data);
      insertNearby(data);
    });
    $.get(this.path_php + "get_hotel_rules.php?id_hotel=" + id, (data) => {
      data = JSON.parse(data);
      console.log(data);
      insertRules(data);
    });
  }
}
