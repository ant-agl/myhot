import insertColumn from "./insertColumn";
import CropText from "./CropText";
import ShowAll from "./ShowAll";
import BackgroundImage from "./BackgroundImage";
import getColor from "./getColor";
import moment from "moment";

export function insertHotel(hotel) {
  $(".hotel__name").text(hotel.name || "??");
  $(".hotel__price-value").text(hotel.price?.toLocaleString() || "??");
  $(".hotel__geo").text(hotel.city || "??");
  $(".hotel__estimation")
    .addClass("color_" + getColor(hotel.rating))
    .text(hotel.rating);

  if (hotel.reviews.length == 0) $(".hotel__reviews-content").css("margin", 0);
  hotel.reviews.forEach((review, i) => {
    if (i > 1) return;
    if (!review.img_src) review.img_src = "../img/no-photo.jpg";
    let name = review.name + review.surname;
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
export function insertServices(services) {
  services.free.forEach((item) => {
    let html = `<div class="services__subtitle">${item.name}</div>`;
    item.list.forEach((service) => {
      html += `<div class="services__item">${service}</div>`;
    });
    let $col1 = $(".services__block_free .services__column").eq(0);
    let $col2 = $(".services__block_free .services__column").eq(1);
    insertColumn($col1, $col2, html);
  });
  services.paid.forEach((item) => {
    let html = `<div class="services__subtitle">${item.name}</div>`;
    item.list.forEach((service) => {
      html += `
        <div class="services__item">
          <span>${service.name}</span>
          <span class="services__price">${service.price}</span>
        </div>`;
    });
    let $col1 = $(".services__block_paid .services__column").eq(0);
    let $col2 = $(".services__block_paid .services__column").eq(1);
    insertColumn($col1, $col2, html);
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
            <div class="reviews__param-name">Расположение</div>
            <div class="reviews__param-progressbar">
              <div class="reviews__param-value">${review.location}</div>
              <div class="reviews__param-progress ${getColor(
                review.location
              )}" style="width:${review.location * 10}%"></div>
            </div>
          </div>
          <div class="reviews__param" data-param="ratio">
            <div class="reviews__param-name">Цена/Качество</div>
            <div class="reviews__param-progressbar">
              <div class="reviews__param-value">${review.ratio}</div>
              <div class="reviews__param-progress ${getColor(
                review.ratio
              )}" style="width:${review.ratio * 10}%"></div>
            </div>
          </div>
          <div class="reviews__param" data-param="conveniences">
            <div class="reviews__param-name">Номер</div>
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
          <div class="reviews__param" data-param="staff">
            <div class="reviews__param-name">Обслуживание</div>
            <div class="reviews__param-progressbar">
              <div class="reviews__param-value">${review.staff}</div>
              <div class="reviews__param-progress ${getColor(
                review.staff
              )}" style="width:${review.staff * 10}%"></div>
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
  rooms.forEach((room, i) => {
    let htmlList = "";
    room.list.forEach((item, j) => {
      if (j >= 4) return;
      htmlList += `<li class="card-room__item">${item}</li>`;
    });
    let html = `
      <div class="card-room page-content">
        <div class="card-room__title">${room.name}</div>
        <div class="card-room__body">
          <div class="card-room__images">
            <div class="card-room__main-img" data-url="${room.images[0]}"></div>
            <div class="card-room__second-images">
              <div class="card-room__second-img" data-url="${room.images[1]}"></div>
              <div class="card-room__second-img" data-url="${room.images[2]}"></div>
            </div>
          </div>
          <div class="card-room__info">
            <ul class="card-room__list" id="rooms-list-${i}">
              ${htmlList}
            </ul>
            <button data-modal-target="modal-room" class="link-underline card-room__show-all">Посмотреть
              полностью</button>
            <div class="card-room__price-block">
              <div class="card-room__price">
                <span class="card-room__price-value">${room.price}</span>
                руб.
              </div>
              <a href="#" class="btn">Забронировать</a>
            </div>
          </div>
        </div>
      </div>
    `;
    $(".card-rooms").append(html);
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

function getText(number) {
  let text = "Отлично";
  if (number <= 7) text = "Хорошо";
  if (number <= 5) text = "Нормально";
  if (number <= 3) text = "Плохо";
  return text;
}
