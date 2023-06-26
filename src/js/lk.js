$("body").hide();
import "./default";

import Menu from "./components/Menu";
new Menu(".main__menu-list", ".tabs-content");

import { get2data } from "./components/data2get";
if (get2data().page) {
  $(`.main__menu-item[data-target="${get2data().page}"]`).trigger("click");
}

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

import Chat from "./components/chat";
new Chat("#chat .chat");

import scrollOverflow from "./components/scrollOverflow";
scrollOverflow($("#modal-review .modal__content"));

import Modal from "./components/Modal";
let modalText = new Modal("#modal-text");
let modalReview = new Modal("#modal-review", {
  closeToBackground: false,
  beforeOpen: ($el) => {
    let hotelId = $el.data("hotel-id");
    let reserveId = $el.data("reserve-id");
    $.ajax({
      type: "GET",
      url: `https://wehotel.ru/php/get_review.php?id_hotel=${hotelId}&reserve_id=${reserveId}`,
      headers: {
        "X-Auth": localStorage.token ?? "",
      },
      beforeSend: () => {
        modalReview.$modal.find(".modal__title span").text("Добавить");
        modalReview.$modal.find(".btn-remove-review").hide();

        modalReview.$modal.find(`[name="hotel_id"]`).val(hotelId);
        modalReview.$modal.find(`[name="reserve_id"]`).val(reserveId);
      },
      success: (data) => {
        // data = {
        //   hotel_id: "",
        //   reserve_id: "",
        //   id: "",
        //   staff: "9",
        //   cleanliness: "2",
        //   location: "3",
        //   conveniences: "4",
        //   comfort: "6",
        //   ration: "8",
        //   opinion: {
        //     well: "Все было круто",
        //     badly: "Все было плохо",
        //   },
        // };
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
          "ration",
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
      if (val != "") data[name] = Number(val);
    }
  });
  console.log(data);

  $.ajax({
    type: "POST",
    url: "https://wehotel.ru/php/edit_review.php",
    data,
    headers: {
      "X-Auth": localStorage.token ?? "",
    },
    success: () => {
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
    hotel_id: $('[name="hotel_id"]'),
    reserve_id: $('[name="reserve_id"]'),
  };
  $.ajax({
    type: "POST",
    url: "https://wehotel.ru/php/delete_review.php",
    data,
    headers: {
      "X-Auth": localStorage.token ?? "",
    },
    success: () => {
      modalReview.close();
    },
    error: () => {
      $("#modal-text .modal__title").text("Что-то пошло не так");
      modalText.open();
    },
  });
});
