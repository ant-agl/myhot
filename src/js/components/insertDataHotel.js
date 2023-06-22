import insertColumn from "./insertColumn";
import CropText from "./CropText";
import ShowAll from "./ShowAll";
import BackgroundImage from "./BackgroundImage";
import getColor from "./getColor";
import moment from "moment";
import { roundNumber } from "./functions";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel";
import Modal from "./Modal";
import MapApi from "./MapApi";
import CheckboxSum from "./CheckboxSum";
import scrollOverflow from "./scrollOverflow";

export function insertHotel(hotel) {
  $(".hotel__name").text(hotel.name || "??");
  $(".hotel__price-value").text(hotel.price?.toLocaleString() || "??");
  $(".hotel__geo").text(hotel.city || "??");
  $(".hotel__place_center").text(roundNumber(hotel.position.center / 1000));
  if (hotel.position.sea)
    $(".hotel__place_sea").text(roundNumber(hotel.position.sea / 1000));
  else $(".hotel__place_sea").closest(".hotel__place").remove();
  $(".hotel__place_metro").text(
    roundNumber(hotel.transport.metro.distance / 1000)
  );
  $(".hotel__place_train").text(
    roundNumber(hotel.transport.train.distance / 1000)
  );
  $(".hotel__place_airport").text(
    roundNumber(hotel.transport.airport.distance / 1000)
  );
  if (hotel.transport.metro.name == "Отсутствует")
    $(".hotel__place_metro-name").parent().text(hotel.transport.metro.name);
  else $(".hotel__place_metro-name").text(hotel.transport.metro.name);
  if (hotel.transport.train.name == "Отсутствует")
    $(".hotel__place_train-name").parent().text(hotel.transport.train.name);
  else $(".hotel__place_train-name").text(hotel.transport.train.name);
  if (hotel.transport.airport.name == "Отсутствует")
    $(".hotel__place_airport-name").parent().text(hotel.transport.airport.name);
  else $(".hotel__place_airport-name").text(hotel.transport.airport.name);

  $(".hotel__stars").html(
    `<img src="../img/icons/stars/${hotel.rating.stars}.png" alt="${hotel.rating.stars} stars" />`
  );
  $(".hotel__estimation")
    .addClass("color_" + getColor(hotel.rating.reviews))
    .text(hotel.rating.reviews);

  let htmlDescription = hotel.description;
  if (hotel.information_hotel) {
    htmlDescription += `<br><br>${hotel.information_hotel}`;
  }
  if (hotel?.data?.url) {
    htmlDescription += `<br><br><a href="${hotel.data.url}" target="_blank">${hotel.data.url}</a>`;
  }
  if (hotel?.data?.phone) {
    htmlDescription += `<br><br><a href="tel:${hotel.data.phone}">${hotel.data.phone}</a>`;
  }
  if (hotel?.data?.email) {
    htmlDescription += `<br><br><a href="mailto:${hotel.data.email}">${hotel.data.email}</a>`;
  }
  $(".hotel__description").html(htmlDescription);

  $(".geo__address-value").text(hotel.address);
  new MapApi({
    coords: [
      {
        coords: hotel?.position?.coordinate || [],
        name: hotel.name,
        image: hotel.image
          ? `<img src="${hotel.image}" style="width:100px;">`
          : "",
      },
    ],
    zoom: 12,
    fixZoom: true,
  });

  let imagesFor =
    hotel.images?.map(
      (url) => `<div class="hotel__slider-for__item" data-url="${url}"></div>`
    ) ?? [];
  let imagesNav =
    hotel.images?.map(
      (url) => `<div class="hotel__slider-nav__item" data-url="${url}"></div>`
    ) ?? [];
  $(".hotel__slider-for").html(imagesFor.join());
  $(".hotel__slider-nav").html(imagesNav.join());

  $(".hotel__slider-for").slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    asNavFor: ".hotel__slider-nav",
    autoplay: true,
  });
  $(".hotel__slider-nav").slick({
    arrows: false,
    slidesToShow: 3,
    slidesToScroll: 1,
    asNavFor: ".hotel__slider-for",
    focusOnSelect: true,
    centerMode: true,
    centerPadding: 0,
  });

  new BackgroundImage(".hotel__slider-for__item", {
    paddingBottom: "75%",
  });
  new BackgroundImage(".hotel__slider-nav__item", {
    paddingBottom: "45%",
    size: "cover",
  });

  if (hotel.reviews.length == 0) $(".hotel__reviews-content").css("margin", 0);
  hotel.reviews.forEach((review, i) => {
    if (i > 1) return;
    if (!review.img_src) review.img_src = "../img/no-photo.jpg";
    let name = review.name + " " + review.surname;
    $(".hotel__reviews-content").append(`
      <div class="hotel__review">
        <div class="hotel__row hotel__row_left">
          <img src="${review.img_src}" alt="${name}" class="hotel__review-img">
          <div class="hotel__review-name">${name}</div>
        </div>
        <div class="hotel__review-text">${review.review}</div>
      </div>
    `);
  });
}
export function insertServices(services, allService) {
  services.free.forEach((id) => {
    let html = "";
    let $category = $(`[data-category="${allService[id].category}]`);
    let category = allService[id].category ?? "";
    if ($category.length == 0 && category) {
      html += `<div class="services__subtitle" data-category="${category}">${category}</div>`;
      html += `<div class="services__item">${allService[id].name}</div>`;

      let $col1 = $(".services__block_free .services__column").eq(0);
      let $col2 = $(".services__block_free .services__column").eq(1);
      insertColumn($col1, $col2, html);
    } else if ($category.length > 0 && category) {
      html += `<div class="services__item">${allService[id].name}</div>`;
      $category.after(html);
    } else {
      html += `<div class="services__item">${allService[id].name}</div>`;

      let $col1 = $(".services__block_free .services__column").eq(0);
      let $col2 = $(".services__block_free .services__column").eq(1);
      insertColumn($col1, $col2, html);
    }
  });
  services.paid.forEach((id, i) => {
    let html = "";
    let $category = $(`[data-category="${allService[id].category}]`);
    let category = allService[id].category ?? "";
    if ($category.length == 0 && category) {
      html += `<div class="services__subtitle" data-category="${category}">${category}</div>`;
      html += `<div class="services__item">${allService[id].name}</div>`;

      let $col1 = $(".services__block_paid .services__column").eq(0);
      let $col2 = $(".services__block_paid .services__column").eq(1);
      insertColumn($col1, $col2, html);
    } else if ($category.length > 0 && category) {
      html += `<div class="services__item">${allService[id].name}</div>`;
      $category.after(html);
    } else {
      html += `<div class="services__item">${allService[id].name}</div>`;

      let $col1 = $(".services__block_paid .services__column").eq(0);
      let $col2 = $(".services__block_paid .services__column").eq(1);
      insertColumn($col1, $col2, html);
    }
  });
}
export function insertRules(rules) {
  let html = "";
  rules.forEach((rule) => {
    html += `<li>${rule}</li>`;
  });
  $(".rules__list").html(html);
}
export function insertNearby(nearby) {
  for (let name in nearby) {
    let html = `<div class="geo__subtitle">${name}</div>`;
    nearby[name]?.forEach((geo) => {
      html += `
        <div class="geo__item">
          <span>${geo.name}</span>
          <span class="geo__distance">${
            Math.round(geo.distance * 100) / 100
          } км</span>
        </div>`;
    });
    let $col1 = $(".geo__column").eq(0);
    let $col2 = $(".geo__column").eq(1);
    insertColumn($col1, $col2, html);
  }
}
export function insertReviewsTotal(total) {
  for (let key in total) {
    let val = total[key];
    let $param = $(`.reviews__total [data-param="${key}"]`);
    $param.find(".reviews__param-value").text(val);
    $param
      .find(".reviews__param-progress")
      .css("width", val * 10 + "%")
      .addClass(getColor(val));
  }
  $(".reviews__total-estimation .reviews__estimation")
    .text(total.rating)
    .addClass(getColor(total.rating));
  $(".reviews__total-estimation .reviews__estimation-text").text(
    getText(total.rating)
  );
}
export function insertReviewsList(reviews) {
  reviews.forEach((review) => {
    let dateTrip =
      moment(review.input_date * 1000).format("DD.MM.YYYY") + " - ";
    dateTrip += moment(review.output_date * 1000).format("DD.MM.YYYY");
    if (!review.img_room) review.img_room = "../img/empty.png";
    if (!review.img_src) review.img_src = "../img/no-photo.jpg";

    let html = `
      <div class="reviews-card page-content">
        <div class="reviews-card__header">
          <div class="reviews-card__dates">
            <div class="reviews-card__date">
              <div class="reviews-card__date-name">Дата отзыва:</div>
              <div class="reviews-card__date-val">${moment(
                review.date * 1000
              ).format("DD.MM.YYYY")}</div>
            </div>
            <div class="reviews-card__date">
              <div class="reviews-card__date-name">Дата поездки:</div>
              <div class="reviews-card__date-val">${dateTrip}</div>
            </div>
          </div>
          <div class="reviews__estimation reviews__estimation_min ${getColor(
            review.rating
          )}">${review.rating}</div>
        </div>
        <div class="reviews-card__row">
          <div class="reviews-card__img">
            <img src="${review.img_room}" alt="${review.name_room}">
          </div>
          <div class="reviews-card__room">${review.name_room}</div>
        </div>
        <div class="reviews-card__params">
          <div class="reviews__param" data-param="staff">
            <div class="reviews__param-name">Персонал</div>
            <div class="reviews__param-progressbar">
              <div class="reviews__param-value">${review.staff}</div>
              <div class="reviews__param-progress ${getColor(
                review.staff
              )}" style="width:${review.staff * 10}%"></div>
            </div>
          </div>
          <div class="reviews__param" data-param="cleanliness">
            <div class="reviews__param-name">Чистота</div>
            <div class="reviews__param-progressbar">
              <div class="reviews__param-value">${review.cleanliness}</div>
              <div class="reviews__param-progress ${getColor(
                review.cleanliness
              )}" style="width:${review.cleanliness * 10}%"></div>
            </div>
          </div>
          <div class="reviews__param" data-param="location">
            <div class="reviews__param-name">Местоположение</div>
            <div class="reviews__param-progressbar">
              <div class="reviews__param-value">${review.location}</div>
              <div class="reviews__param-progress ${getColor(
                review.location
              )}" style="width:${review.location * 10}%"></div>
            </div>
          </div>
          <div class="reviews__param" data-param="conveniences">
            <div class="reviews__param-name">Удобства</div>
            <div class="reviews__param-progressbar">
              <div class="reviews__param-value">${review.conveniences}</div>
              <div class="reviews__param-progress ${getColor(
                review.conveniences
              )}" style="width:${review.conveniences * 10}%"></div>
            </div>
          </div>
          <div class="reviews__param" data-param="comfort">
            <div class="reviews__param-name">Комфорт</div>
            <div class="reviews__param-progressbar">
              <div class="reviews__param-value">${review.comfort}</div>
              <div class="reviews__param-progress ${getColor(
                review.comfort
              )}" style="width:${review.comfort * 10}%"></div>
            </div>
          </div>
          <div class="reviews__param" data-param="ratio">
            <div class="reviews__param-name">Соотношение цена/качество</div>
            <div class="reviews__param-progressbar">
              <div class="reviews__param-value">${review.ratio}</div>
              <div class="reviews__param-progress ${getColor(
                review.ratio
              )}" style="width:${review.ratio * 10}%"></div>
            </div>
          </div>
        </div>
        <div class="reviews-card__main">
          <div class="reviews-card__human">
            <div class="reviews-card__avatar">
              <img src="${review.img_src}" alt="${review.name}">
            </div>
            <div class="reviews-card__name">${review.name}</div>
          </div>
          <div class="reviews-card__text-title reviews-card__text-title_green">Что было хорошо</div>
          <div class="reviews-card__text">
            ${review.review_well || "Ничего"}
          </div>
          <div class="reviews-card__text-title reviews-card__text-title_red">Что было плохо</div>
          <div class="reviews-card__text">
            ${review.review_badly || "Ничего"}
          </div>
        </div>
      </div>
    `;

    let $col1 = $(".reviews__column").eq(0);
    let $col2 = $(".reviews__column").eq(1);
    insertColumn($col1, $col2, html);
  });
  new CropText({
    selector: ".reviews-card__text",
    maxHeight: 220,
  });
}
export function insertRooms(rooms) {
  $(".card-rooms").html("");
  rooms.forEach((room, i) => {
    let html = `
      <div class="card-room page-content">
        <div class="card-room__title">${room.name}</div>
        <div class="card-room__body">
          <div class="card-room__images">
            <div class="card-room__main-img" data-url="${room.images[0]}"></div>
            <div class="card-room__second-images">
              <div class="card-room__second-img" data-url="${
                room.images[1]
              }"></div>
              <div class="card-room__second-img" data-url="${
                room.images[2]
              }"></div>
            </div>
          </div>
          <div class="card-room__info">
            <ul class="card-room__list" id="rooms-list-${i}">
              ${room.description}
            </ul>
            <button data-modal-target="modal-room-${
              room.id
            }" class="link-underline card-room__show-all">
              Посмотреть полностью
            </button>
            <div class="card-room__price-block">
              <div class="card-room__price">
                <span class="card-room__price-value">${room.price.toLocaleString()}</span>
                руб.
              </div>
              <a href="#" class="btn">Забронировать</a>
            </div>
          </div>
        </div>
      </div>
    `;
    $(".card-rooms").append(html);
    let interval = setInterval(() => {
      if ($(`#modal-room-${room.id}`).length == 0) return;
      console.log($(`#modal-room-${room.id}`));
      new Modal(`#modal-room-${room.id}`);
      clearInterval(interval);
    }, 1);
    // new ShowAll("btn-show-all-" + i, {
    //   minShowElements: 4,
    //   textShow: "Скрыть",
    //   textHide: "Посмотреть полностью",
    // });
  });
  new BackgroundImage(".card-room__main-img", {
    paddingBottom: "40%",
    size: "cover",
  });
  new BackgroundImage(".card-room__second-img", {
    paddingBottom: "20%",
    size: "cover",
  });
}

export function insertDataRoom(room) {
  if ($(`#modal-room-${room.id}`).length) return;

  $("body").append(`
    <div class="modal" id="modal-room-${room.id}">
      <div class="modal__content">
        <div class="modal-room__main">
          <div class="modal-room__images">
            <div class="modal-room__main-img" data-url="${
              room.images[0]
            }"></div>
            <div class="modal-room__second-images">
              <div class="modal-room__second-img" data-url="${
                room.images[1]
              }"></div>
              <div class="modal-room__second-img" data-url="${
                room.images[2]
              }"></div>
            </div>
          </div>
          <div class="modal-room_info">
            <div class="modal-room__name">${room.name}</div>
            <div class="modal-room__row">${room.description}</div>
            <div class="modal-room__price-block">
              <div class="modal-room__price">
                <span class="modal-room__price-value">${room.price.toLocaleString()}</span>
                руб.
              </div>
              <a href="#" class="btn">Забронировать</a>
            </div>
          </div>
        </div>
        <div class="modal-room__title">Доступные бесплантые услуги для данного номера</div>
        <div class="modal-room__free-list">
          <div class="modal-room__free-column">
            <div class="modal-room__subtitle">Общее</div>
            <div class="modal-room__item">Банкомат</div>
            <div class="modal-room__item">Индивидуальная регистрация заезда и отъезда</div>
            <div class="modal-room__item">Кондиционер</div>
            <div class="modal-room__item">Круглосуточная стойка регистрации</div>
            <div class="modal-room__item">Лифт</div>
            <div class="modal-room__item">Отель для некурящих</div>
            <div class="modal-room__subtitle">Интернет</div>
            <div class="modal-room__item">Бесплатный Wi-Fi</div>
            <div class="modal-room__subtitle">Туризм</div>
            <div class="modal-room__item">Экскурсионное бюро</div>
          </div>
          <div class="modal-room__free-column">
            <div class="modal-room__subtitle">В номерах</div>
            <div class="modal-room__item">Люкс для новобрачных</div>
            <div class="modal-room__item">Сейф (в номере)</div>
            <div class="modal-room__subtitle">Услуги и удобства</div>
            <div class="modal-room__item">Услуги консьержа</div>
            <div class="modal-room__item">Фен (по запросу)</div>
            <div class="modal-room__subtitle">Питание</div>
            <div class="modal-room__item">Диетическое меню (по запросу)</div>
            <div class="modal-room__subtitle">Персонал говорит</div>
            <div class="modal-room__item">на английском</div>
            <div class="modal-room__item">на русском</div>
          </div>
        </div>
        <div class="modal-room__title" id="paid-service-${
          room.id
        }" data-target="paid-service__list-${
    room.id
  }">Выберете платные услуги +</div>
        <div class="modal-room__paid-block" id="paid-service__list-${room.id}">
          <div class="modal-room__paid-list">
            <div class="modal-room__paid-column">
              <div class="modal-room__subtitle">Услуги и удобства</div>
              <div class="modal-room__item">
                <label>
                  <input type="checkbox" value="500">
                  Гладильные услуги
                </label>
                <div class="modal-room__item-price">500 руб.</div>
              </div>
              <div class="modal-room__item">
                <label>
                  <input type="checkbox" value="500">
                  Прачечная
                </label>
                <div class="modal-room__item-price">500 руб.</div>
              </div>
              <div class="modal-room__item">
                <label>
                  <input type="checkbox" value="500">
                  Химчистка
                </label>
                <div class="modal-room__item-price">500 руб.</div>
              </div>
              <div class="modal-room__item">
                <label>
                  <input type="checkbox" value="600">
                  Чистка обуви
                </label>
                <div class="modal-room__item-price">600 руб.</div>
              </div>
              <div class="modal-room__subtitle">Красота и здоровье</div>
              <div class="modal-room__item">
                <label>
                  <input type="checkbox" value="1200">
                  Массаж
                </label>
                <div class="modal-room__item-price">1 200 руб.</div>
              </div>
              <div class="modal-room__item">
                <label>
                  <input type="checkbox" value="1600">
                  Салон красоты
                </label>
                <div class="modal-room__item-price">1 600 руб.</div>
              </div>
              <div class="modal-room__item">
                <label>
                  <input type="checkbox" value="2000">
                  Спа-центр
                </label>
                <div class="modal-room__item-price">2 000 руб.</div>
              </div>
            </div>
            <div class="modal-room__paid-column">
              <div class="modal-room__subtitle">Парковка</div>
              <div class="modal-room__item">
                <label>
                  <input type="checkbox" value="8200">
                  Парковка
                </label>
                <div class="modal-room__item-price">8 200 руб.</div>
              </div>
              <div class="modal-room__subtitle">Трансфер</div>
              <div class="modal-room__item">
                <label>
                  <input type="checkbox" value="7800">
                  Трансфер
                </label>
                <div class="modal-room__item-price">7 800 руб.</div>
              </div>
              <div class="modal-room__subtitle">Животные</div>
              <div class="modal-room__item">
                <label>
                  <input type="checkbox" value="1000">
                  Размещение с домашними животными
                </label>
                <div class="modal-room__item-price">1 000 руб.</div>
              </div>
            </div>
          </div>
          <div class="modal-room__paid-total">
            <span>Всего за платные услуги</span>
            <div class="modal-room__paid-total-value">0 руб.</div>
          </div>
        </div>
      </div>
    </div>
  `);

  new ShowAll(`paid-service-${room.id}`, {
    minShowElements: 0,
    gap: 0,
    textShow: "Выберете платные услуги —",
    textHide: "Выберете платные услуги +",
  });

  new BackgroundImage(`#modal-room-${room.id} .modal-room__main-img`, {
    paddingBottom: "40%",
    size: "cover",
  });
  new BackgroundImage(`#modal-room-${room.id} .modal-room__second-img`, {
    paddingBottom: "20%",
    size: "cover",
  });

  scrollOverflow($(`#modal-room-${room.id} .modal__content`));

  let cSum = new CheckboxSum(
    `#modal-room-${room.id} .modal-room__paid-list`,
    `#modal-room-${room.id} .modal-room__paid-total-value`
  );
  cSum.updateAnswer();
}

function getText(number) {
  let text = "Отлично";
  if (number <= 7) text = "Хорошо";
  if (number <= 5) text = "Нормально";
  if (number <= 3) text = "Плохо";
  return text;
}
