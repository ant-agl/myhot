import "./default";

import "air-datepicker/air-datepicker.css";
import AirDatepicker from "air-datepicker";
import moment from "moment";

let birthday = new AirDatepicker("#date", {
  autoClose: true,
  position: "bottom center",
  isMobile: $(window).outerWidth() <= 767,
  maxDate: moment().subtract(18, "years"),
});
$(window).resize(() => {
  let w = $(window).outerWidth();
  birthday.update({
    isMobile: w <= 767,
  });
});

import GetData from "./components/GetData";
let getData = new GetData();
getData.getLk({
  user: birthday,
});

import Menu from "./components/Menu";
new Menu(".main__menu-list", ".tabs-content");

import Chat from "./components/chat";
new Chat("#chat .chat");

import { get2data } from "./components/data2get";
if (get2data().page) {
  $(`.main__menu-item[data-target="${get2data().page}"]`).trigger("click");
}
if (get2data().id_chat) {
  let time = 0;
  setTimeout(function openChat() {
    let $item = $(
      `.tab-content#chat .chats__item[data-id="${get2data().id_chat}"]`
    );
    if ($item.length) {
      $item.trigger("click");
    } else if (time <= 2000) {
      time += 100;
      setTimeout(openChat, 100);
    }
  });
}

import "./components/profile";

$(".input-hint_dfa").on("click", () => $('[name="2fa"]').focus());

function reloadChatAnimation(close = true) {
  if (close) {
    $(".chat-preview__message").addClass(
      "chat-preview__message-clear-animation"
    );
  }
  $(".chat-preview__message").removeClass("chat-preview__message-animation");
  setTimeout(() => {
    $(".chat-preview__message").addClass("chat-preview__message-animation");
  }, 200);
}
reloadChatAnimation(false);
setInterval(reloadChatAnimation, 1000 * 8);

// import scrollOverflow from "./components/scrollOverflow";
// scrollOverflow($("#modal-review .modal__content"));

import Modal from "./components/Modal";
let modalText = new Modal("#modal-text");
let modalReview = new Modal("#modal-review", {
  closeToBackground: false,
  beforeOpen: ($el) => {
    let hotelId = $el.data("hotel-id");
    let reserveId = $el.data("reserve-id");
    let isReview = $el.data("is-review") == 1;

    modalReview.$modal.find(".modal__title span").text("Добавить");
    modalReview.$modal.find(".btn-remove-review").hide();

    modalReview.$modal.find(`[name="id"]`).val("");
    modalReview.$modal.find(`[name="hotel_id"]`).val(hotelId);
    modalReview.$modal.find(`[name="reserve_id"]`).val(reserveId);

    modalReview.$modal.find(`[type="radio"][value="10"]`).prop("checked", true);
    modalReview.$modal
      .find(`[name="opinion.well"], [name="opinion.badly"]`)
      .val("");

    if (!isReview) return true;

    $.ajax({
      type: "GET",
      url: `https://bytrip.ru/php/get_review.php?hotel_id=${hotelId}&reserve_id=${reserveId}`,
      headers: {
        "X-Auth": localStorage.token ?? "",
      },
      success: (data) => {
        data = JSON.parse(data);
        console.log("get_review", data);
        if (!data.id) return;

        modalReview.$modal.find(".modal__title span").text("Редактировать");
        modalReview.$modal.find(".btn-remove-review").show();

        let arrRadio = [
          "staff",
          "cleanliness",
          "location",
          "conveniences",
          "comfort",
          "ratio",
        ];
        arrRadio.forEach((name) => {
          modalReview.$modal
            .find(`[name="${name}"][value="${data[name]}"]`)
            .prop("checked", true);
        });
        modalReview.$modal.find(`[name="id"]`).val(data.id);
        modalReview.$modal
          .find(`[name="opinion.well"]`)
          .val(data.opinion?.well || "");
        modalReview.$modal
          .find(`[name="opinion.badly"]`)
          .val(data.opinion?.badly || "");
      },
    });
    return true;
  },
});

import Validation from "./components/Validation";
let validationReview = new Validation("#modal-review");
$("body").on("click", ".btn-add-review", function () {
  if (!validationReview.validate()) return;
  let data = {};
  $("#modal-review input, #modal-review textarea").each((i, el) => {
    if ($(el).attr("type") == "radio" && !$(el).prop("checked")) return;
    let name = $(el).attr("name");
    let val = $(el).val().trim();
    if (name.split(".").length > 1) {
      let names = name.split(".");
      if (!data[names[0]]) data[names[0]] = {};
      data[names[0]][names[1]] = val;
    } else {
      if (val != "") data[name] = val;
    }
  });
  console.log(data);

  $.ajax({
    type: "POST",
    url: "https://bytrip.ru/php/edit_review.php",
    data,
    headers: {
      "X-Auth": localStorage.token ?? "",
    },
    success: () => {
      $(
        `.btn-open-review[data-hotel-id=${data.hotel_id}][data-reserve-id=${data.reserve_id}]`
      )
        .data("is-review", 1)
        .text("Редактировать отзыв");
      modalReview.close();
    },
    error: () => {
      $("#modal-text .modal__title").text("Что-то пошло не так");
      modalText.open();
    },
  });
});

$("body").on("click", ".btn-remove-review", function () {
  let data = {
    hotel_id: $('[name="hotel_id"]').val(),
    reserve_id: $('[name="reserve_id"]').val(),
  };
  $.ajax({
    type: "POST",
    url: "https://bytrip.ru/handler/delete_review.php",
    data,
    headers: {
      "X-Auth": localStorage.token ?? "",
    },
    success: () => {
      $(
        `.btn-open-review[data-hotel-id=${data.hotel_id}][data-reserve-id=${data.reserve_id}]`
      )
        .data("is-review", 0)
        .text("Оставить отзыв");

      modalReview.close();
    },
    error: () => {
      $("#modal-text .modal__title").text("Что-то пошло не так");
      modalText.open();
    },
  });
});

let validationForm = new Validation(".form_send", {
  isOutputErrors: false,
});

$(".form_send").on("submit", function (e) {
  e.preventDefault();

  if (!validationForm.validate()) return;

  let data = {
    message: $('[name="question-text"]').val()?.trim() || "",
    email: $('[name="question-mail"]').val()?.trim() || "",
  };
  $.ajax({
    type: "POST",
    url: "https://bytrip.ru/handler/send_request.php",
    data,
    headers: {
      "X-Auth": localStorage.token ?? "",
    },
    success: () => {
      $("#modal-text .modal__title").text("Письмо успешно отправлено");
      modalText.open();

      $('[name="question-text"]').val("");
      $('[name="question-mail"]').val("");
    },
    error: () => {
      $("#modal-text .modal__title").text("Что-то пошло не так");
      modalText.open();
    },
  });
});

$("body").on("click", ".btn-go-sup", function (e) {
  e.preventDefault();
  setTimeout(() => {
    $(".chats__item.support-chat").trigger("click");
  });
});

import ConfirmPassword from "./components/ConfirmPassword";
let confirmCancel = new ConfirmPassword(
  "#modal-confirm-cancel .input-code-confirm",
  "#modal-confirm-cancel .btn-confirm-cancel",
  { url: "https://bytrip.ru/handler/cancel_reserve_code.php" }
);

let modalCancelBooking = new Modal("#modal-confirm-cancel", {
  closeToBackground: false,
  beforeOpen: () => {
    confirmCancel.clearAll();
    confirmCancel.focusFirst();
    return true;
  },
});

confirmCancel.afterSendSuccess = (data) => {
  modalCancelBooking.close();
  console.log(data);

  return;
  let $hotel = $(`.hotel-card__status[data-id=${id}]`);
  let $hint = $hotel.find(".hotel-card__status .value");
  $hint.find("span").text("Отмена");
  $hint.find(".hint__text").text("Отмена бронирования");
  $hotel.find(".hotel-card__btns").remove();
};
confirmCancel.afterSendError = () => {
  $("#modal-text .modal__title").text("Что-то пошло не так");
  modalText.open();
};

$("body").on("click", ".btn-cancel-booking", function () {
  let reserveId = $(this).data("reserve-id");
  if (!reserveId) return;
  $.ajax({
    type: "POST",
    url: "https://bytrip.ru/handler/cancel_reserve.php",
    data: {
      id: reserveId,
    },
    headers: {
      "X-Auth": localStorage.token ?? "",
    },
    success: (data) => {
      console.log(data);
      modalCancelBooking.open();
    },
    error: () => {
      $("#modal-text .modal__title").text("Что-то пошло не так");
      modalText.open();
    },
  });
});

$("body").on("click", ".btn-pay-booking", function () {
  let reserveId = $(this).data("reserve-id");
  if (!reserveId) return;
  $.ajax({
    type: "POST",
    url: "https://bytrip.ru/handler/get_pay_generation.php",
    data: {
      id_reserve: reserveId,
    },
    headers: {
      "X-Auth": localStorage.token ?? "",
    },
    success: (data) => {
      location.href = data.url;
    },
    error: (xhr) => {
      let textError = "Что-то пошло не так";
      if (xhr.status == 410) {
        textError = "Истёк срок платежа";
      }

      $("#modal-text .modal__title").text(textError);
      modalText.open();
    },
  });
});
