import "./default";

let id_hotel = false;

import Modal from "./components/Modal";
let modalText = new Modal("#modal-text");
import { get2data, data2get } from "./components/data2get";
import "jquery-mask-plugin";
import CheckboxSumTotal from "./components/CheckboxSumTotal";
import { insertServices } from "./components/insertServices";
import moment from "moment";
moment.locale("ru");

import Validation from "./components/Validation";
let validationForm = new Validation(".booking-form", {
  isOutputErrors: false,
});

$.ajax({
  type: "GET",
  url: "https://wehotel.ru/handler/get_reserve_temp.php",
  headers: {
    "X-Auth": localStorage.token ?? "",
  },
  success: (data) => {
    data = JSON.parse(data);
    console.log(data);

    id_hotel = data.id_hotel;

    $(".booking-hotel__img img").attr(
      "src",
      data.hotel.image || "../img/empty.png"
    );
    $(".booking-hotel__stars").attr(
      "src",
      `../img/icons/stars/${data.hotel.stars}.png`
    );
    if (data.favourite) $(".booking-hotel__heart").addClass("active");
    $(".booking-hotel__name").text(data.hotel.name);
    $(".booking-hotel__address").text(data.hotel.address);

    let peoples = [];
    if (data.number.adults == 1) peoples.push(data.number.adults + " взрослый");
    else if (data.number.adults > 1)
      peoples.push(data.number.adults + " взрослых");

    if (data.number.children == 1)
      peoples.push(data.number.children + " ребенок");
    else if (data.number.children > 1)
      peoples.push(data.number.children + " ребенка");

    let peoplesText = peoples.length > 0 ? peoples.join(", ") : "&mdash;";

    $(".booking-hotel__people").text(peoplesText);
    $(".booking-hotel__description").text(data.hotel.description);
    $(".booking-hotel__price-value, .booking-total__room-price span").text(
      data.cost.night.toLocaleString()
    );
    let servicesPrice =
      data.services?.price?.reduce((total, n) => {
        return (total += parseFloat(n));
      }, 0) || 0;
    $(
      ".booking-total__paid-price span, .booking-services__total-price span"
    ).text(servicesPrice.toLocaleString());
    $(".booking-total__total-price span").text(data.cost.full.toLocaleString());
    new CheckboxSumTotal(
      ".booking-services__list_paid",
      ".booking-services__total-price, .booking-total__paid-price",
      {
        defaultPrice: data.cost.night,
        selectorTotal: ".booking-total__total-price",
      }
    );

    let fromWeekday = moment(data.date.input * 1000).format("dddd");
    fromWeekday = fromWeekday[0].toUpperCase() + fromWeekday.slice(1);
    let toWeekday = moment(data.date.output * 1000).format("dddd");
    toWeekday = toWeekday[0].toUpperCase() + toWeekday.slice(1);
    $('[data-type="from-weekday"]').text(fromWeekday);
    $('[data-type="from-date"]').text(
      moment(data.date.input * 1000).format("D MMMM YYYY")
    );
    $('[data-type="to-weekday"]').text(toWeekday);
    $('[data-type="to-date"]').text(
      moment(data.date.output * 1000).format("D MMMM YYYY")
    );

    $('[name="surname"]').val(data.surname || "");
    $('[name="name"]').val(data.name || "");
    $('[name="patronymic"]').val(data.patronymic || "");
    $('[name="phone"]').val($('[name="phone"]').masked(data.phone || ""));
    $('[name="email"]').val(data.email || "");

    let columns = {
      free: {
        $col1: $(".booking-services__column_free").eq(0),
        $col2: $(".booking-services__column_free").eq(1),
        class: "booking-services__column_free",
      },
      paid: {
        $col1: $(".booking-services__column_paid").eq(0),
        $col2: $(".booking-services__column_paid").eq(1),
        class: "booking-services__column_paid",
      },
    };
    insertServices(data.room.services, columns, {
      isInput: true,
      $block: $(`.booking-services`),
      classes: {
        row: "booking-services__row",
        price: "booking-services__price",
        category: "booking-services__category",
      },
    }).then(() => {
      data.services?.paid?.forEach((id) => {
        console.log($(`.booking-services__row [data-id="${id}"]`));
        $(`.booking-services__row [data-id="${id}"]`).prop("checked", true);
      });
    });
  },
  error: (xhr) => {
    console.log(xhr.status);
    let getParams = get2data();
    if (getParams.id) location.href = "/hotel" + data2get(getParams);
    else location.href = "/hotels-list" + data2get(getParams);
  },
});

import GuestList from "./components/GuestList";
new GuestList(
  ".booking-form__guests",
  ".booking-form__add-guest",
  ".booking-form__remove-guest",
  ".booking-form__guest"
);

import ShowAll from "./components/ShowAll";
new ShowAll("free-service", {
  minShowElements: 0,
  gap: 0,
  textShow: "Бесплатные услуги -",
  textHide: "Бесплатные услуги +",
});
new ShowAll("paid-service", {
  minShowElements: 0,
  gap: 0,
  textShow: "Выберете платные услуги —",
  textHide: "Выберете платные услуги +",
});

$(".booking-btn").on("click", function (e) {
  e.preventDefault();

  if (!validationForm.validate()) return;

  let paidService = [];
  let priceService = [];
  $(`.booking-services_paid [type="checkbox"]:checked`).each((i, el) => {
    paidService.push($(el).data("id"));
    priceService.push($(el).val());
  });

  let data = {
    surname: $('.booking-form [name="surname"]').val().trim(),
    name: $('.booking-form [name="name"]').val().trim(),
    patronymic: $('.booking-form [name="patronymic"]').val().trim(),
    phone: $('.booking-form [name="phone"]').val().trim(),
    email: $('.booking-form [name="email"]').val().trim(),
    services: {
      paid: paidService,
      price: priceService,
    },
    wishes: $('.booking-form [name="wishes"]').val().trim(),
  };
  console.log(data);

  $.ajax({
    type: "POST",
    url: "https://wehotel.ru/handler/reserve.php",
    data,
    headers: {
      "X-Auth": localStorage.token ?? "",
    },
    success: () => {
      location.href = "/lk?page=booking";
    },
    error: (xhr) => {
      console.log(xhr.status);
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
          $("#modal-text .modal__title").text("Данный номер уже забронирован");
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

$("body").on("click", ".booking-hotel__heart", function () {
  $(this).toggleClass("active");

  if (id_hotel === false) return;
  let get = data2get({
    hotel_id: id_hotel,
  });
  let file = "";
  if ($(this).hasClass("active")) {
    console.log("add " + id_hotel);
    file = "add_favourites.php";
  } else {
    console.log("remove " + id_hotel);
    file = "delete_favourites.php";
  }
  $.ajax({
    type: "GET",
    url: "https://wehotel.ru/handler/" + file + get,
    headers: {
      "X-Auth": localStorage.token ?? "",
    },
  });
});
