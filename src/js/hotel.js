import "./default";
import CropText from "./components/CropText";
new CropText({
  selector: ".hotel__review-text",
  maxHeight: 54,
});

import Modal from "./components/Modal";
let modalText = new Modal("#modal-text");

import Menu from "./components/Menu";
new Menu(".main__menu-list", ".tabs-content");

import { get2data, data2get } from "./components/data2get";
import GetData from "./components/GetData";
let hotelId = get2data().id;
let person = get2data().person || 1;
let input_date = get2data().input_date;
let output_date = get2data().output_date;
if (!hotelId && history.length > 2) history.back();
else if (!hotelId) location.href = "/";
let getData = new GetData();
getData.hotel({ hotelId, input_date, output_date, person });

import ChangeDateBlock from "./components/ChangeDateBlock";
new ChangeDateBlock(".dates-booking");

$(".btn-back").on("click", function (e) {
  e.preventDefault();
  location.href = "/hotels-list" + data2get(get2data());
});

import MobileDetect from "mobile-detect";
let md = new MobileDetect(window.navigator.userAgent);
let isPhone = !!md.phone() || !!md.tablet();
console.log(get2data());
$("body").on("click", ".btn-booking-temp", function (e) {
  e.preventDefault();

  let roomId = $(this).data("room-id");
  let price = $(`.card-room[data-id="${roomId}"] .card-room__price-value`)
    .text()
    .replace(/\s/g, "");
  let servicesTotal = $(`#modal-room-${roomId} .modal-room__paid-total-value`)
    .text()
    .replace(/\D/g, "");

  let paidService = [];
  let priceService = [];
  $(`#modal-room-${roomId} .modal-room__item [type="checkbox"]:checked`).each(
    (i, el) => {
      paidService.push($(el).data("id"));
      priceService.push($(el).val());
    }
  );

  let getParams = get2data();
  let childrenAge;
  try {
    childrenAge = JSON.parse(decodeURIComponent(getParams.childAge || "[]"));
  } catch (e) {
    console.log(e);
    childrenAge = [];
  }

  let adults = Number(getParams.adult || 0);
  let kidsCount = childrenAge.length || 0;
  let person = adults + kidsCount;

  let data = {
    adults,
    kids: childrenAge,
    person,
    input_date: getParams.input_date,
    output_date: getParams.output_date,
    paid: paidService,
    price: priceService,
    night: price,
    services: servicesTotal,
    id_hotel: Number(getParams.id),
    id_room: roomId,
    device: isPhone ? 1 : 0,
  };
  console.log(data);

  if (!localStorage.token) {
    $(".modal").removeClass("modal_open");
    $(".log_in_button").trigger("click");
    return;
  }
  $.ajax({
    type: "POST",
    url: "https://wehotel.ru/handler/reserve_temp.php",
    data,
    headers: {
      "X-Auth": localStorage.token ?? "",
    },
    success: (data) => {
      // console.log(data);
      location.href = "/booking" + data2get(getParams);
    },
    error: (xhr) => {
      switch (xhr.status) {
        case 403:
          $("#modal-text .modal__title").text(
            "Ваша сессия истекла. Пожалуйста, обновите страницу"
          );
          break;
        case 409: //неверные цены
          $("#modal-text .modal__title").text(
            "Цена на данный номер изменилась. Пожалуйста, обновите страницу"
          );
          break;
        case 400: //бронь
          $("#modal-text .modal__title").text(
            "Данный номер уже забронирован. Пожалуйста, обновите страницу"
          );
          break;
        case 410: //попытка второй брони
          $("#modal-text .modal__title").text(
            "У вас уже есть предварительная бронь номера. Попробуйте позже"
          );
          break;

        default:
          $("#modal-text .modal__title").text(
            "Неизвестная ошибка. Пожалуйста, обновите страницу"
          );
          break;
      }
      $(".modal").removeClass("modal_open");
      modalText.open();
    },
  });
});

$("body").on("click", ".btn-msg-hotel", function (e) {
  e.preventDefault();

  if (!localStorage.token) {
    $(".log_in_button").trigger("click");
    return;
  }

  let id_hotel = get2data().id;
  $.ajax({
    type: "POST",
    url: "https://wehotel.ru/php/chat/create_chat.php",
    data: {
      id_hotel,
    },
    headers: {
      "X-Auth": localStorage.token ?? "",
    },
    success: (data) => {
      data = JSON.parse(data);
      console.log(data);

      location.href = "/lk?page=chat&id_chat=" + data.id;
    },
    error: (xhr) => {
      $("#modal-text .modal__title").text("Что-то пошло не так");
      $(".modal").removeClass("modal_open");
      modalText.open();
    },
  });
});
