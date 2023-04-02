import insertColumn from "./insertColumn";
import CropText from "./CropText";
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
  nearby.forEach((item) => {
    let html = `<div class="geo__subtitle">${item.name}</div>`;
    item.list.forEach((geo) => {
      html += `
        <div class="geo__item">
          <span>${geo.name}</span>
          <span class="geo__distance">${geo.distance}</span>
        </div>`;
    });
    let $col1 = $(".geo__column").eq(0);
    let $col2 = $(".geo__column").eq(1);
    insertColumn($col1, $col2, html);
  });
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
    .text(total.estimation)
    .addClass(getColor(total.estimation));
  $(".reviews__total-estimation .reviews__estimation-text").text(
    getText(total.estimation)
  );
}
export function insertReviewsList(reviews) {
  reviews.forEach((review) => {
    let html = `
      <div class="reviews-card page-content">
        <div class="reviews-card__header">
          <div class="reviews-card__dates">
            <div class="reviews-card__date">
              <div class="reviews-card__date-name">Дата отзыва</div>
              <div class="reviews-card__date-val">${review.dateReview}</div>
            </div>
            <div class="reviews-card__date">
              <div class="reviews-card__date-name">Дата поездки</div>
              <div class="reviews-card__date-val">${review.dateTrip}</div>
            </div>
          </div>
          <div class="reviews__estimation reviews__estimation_min ${getColor(
            review.estimation
          )}">${review.estimation}</div>
        </div>
        <div class="reviews-card__row">
          <div class="reviews-card__img">
            <img src="${review.img}" alt="${review.nameRoom}">
          </div>
          <div class="reviews-card__room">${review.nameRoom}</div>
        </div>
        <div class="reviews-card__params">
          <div class="reviews__param" data-param="clear">
            <div class="reviews__param-name">Чистота</div>
            <div class="reviews__param-progressbar">
              <div class="reviews__param-value">${review.clear}</div>
              <div class="reviews__param-progress ${getColor(
                review.clear
              )}" style="width:${review.clear * 10}%"></div>
            </div>
          </div>
          <div class="reviews__param" data-param="hygiene">
            <div class="reviews__param-name">Гигиена</div>
            <div class="reviews__param-progressbar">
              <div class="reviews__param-value">${review.hygiene}</div>
              <div class="reviews__param-progress ${getColor(
                review.hygiene
              )}" style="width:${review.hygiene * 10}%"></div>
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
          <div class="reviews__param" data-param="food">
            <div class="reviews__param-name">Питание</div>
            <div class="reviews__param-progressbar">
              <div class="reviews__param-value">${review.food}</div>
              <div class="reviews__param-progress ${getColor(
                review.food
              )}" style="width:${review.food * 10}%"></div>
            </div>
          </div>
          <div class="reviews__param" data-param="price">
            <div class="reviews__param-name">Цена/Качество</div>
            <div class="reviews__param-progressbar">
              <div class="reviews__param-value">${review.price}</div>
              <div class="reviews__param-progress ${getColor(
                review.price
              )}" style="width:${review.price * 10}%"></div>
            </div>
          </div>
          <div class="reviews__param" data-param="number">
            <div class="reviews__param-name">Номер</div>
            <div class="reviews__param-progressbar">
              <div class="reviews__param-value">${review.number}</div>
              <div class="reviews__param-progress ${getColor(
                review.number
              )}" style="width:${review.number * 10}%"></div>
            </div>
          </div>
          <div class="reviews__param" data-param="service">
            <div class="reviews__param-name">Обслуживание</div>
            <div class="reviews__param-progressbar">
              <div class="reviews__param-value">${review.service}</div>
              <div class="reviews__param-progress ${getColor(
                review.service
              )}" style="width:${review.service * 10}%"></div>
            </div>
          </div>
          <div class="reviews__param" data-param="wifi">
            <div class="reviews__param-name">Качество Wi-Fi</div>
            <div class="reviews__param-progressbar">
              <div class="reviews__param-value">${review.wifi}</div>
              <div class="reviews__param-progress ${getColor(
                review.wifi
              )}" style="width:${review.wifi * 10}%"></div>
            </div>
          </div>
        </div>
        <div class="reviews-card__main">
          <div class="reviews-card__human">
            <div class="reviews-card__avatar">
              <img src="${review.avatar}" alt="${review.name}">
            </div>
            <div class="reviews-card__name">${review.name}</div>
          </div>
          <div class="reviews-card__text">
            ${review.text}
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

function getColor(number) {
  let color = "green";
  if (number <= 7) color = "lightgreen";
  if (number <= 5) color = "yellow";
  if (number <= 3) color = "red";
  return color;
}
function getText(number) {
  let text = "Отлично";
  if (number <= 7) text = "Хорошо";
  if (number <= 5) text = "Нормально";
  if (number <= 3) text = "Плохо";
  return text;
}