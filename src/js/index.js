import "./index/uikit.min";
import "./index/uikit-icons.min";

import "jquery-mask-plugin";
$(".mask-phone").mask("+7 (000) 000-00-00", {
  placeholder: "+7 (___) ___-__-__",
});

import ConfirmPassword from "./components/ConfirmPassword";
let confirmPass1 = new ConfirmPassword(
  ".block_register_01 .phone_code",
  ".block_register_01 .next_button",
  {
    url: "",
  }
);
let confirmPass02 = new ConfirmPassword(
  ".block_register_02 .phone_code",
  ".block_register_02 .next_button",
  {
    url: "",
  }
);
let confirmPass2 = new ConfirmPassword(
  ".block_register_2 .phone_code",
  ".block_register_2 .next_button",
  {
    url: "",
  }
);

import "air-datepicker/air-datepicker.css";
import AirDatepicker from "air-datepicker";
new AirDatepicker(".text-field__input_2", {
  autoClose: true,
  range: true,
  multipleDatesSeparator: " - ",
  minDate: new Date(),
  isMobile: window.outerWidth < 700,
});

import DropMenu from "./components/DropMenu";
new DropMenu(".button_block_open", {
  classActive: "open",
  selectorsNotClose: [".count-guest__modal", ".delete-child"],
});

import InputCount from "./components/InputCount";
new InputCount();

$(".count-adult").on("input change", function () {
  let val = $(this).val();
  $(".count-guest__value .adult").text(val);
});
$("body").on("click", ".add-child, .delete-child", function () {
  setTimeout(() => {
    let val = $(".count-child").length;
    $(".count-guest__value .child").text(val);
  });
});

$(".add-child").on("click", function () {
  $(this).before(`
    <div class="count-guest__row count-child">
      <span class="count-guest__row delete-child">
        <img src="../img/icons/cross.png">
        Ребенок
      </span>
      <div class="count-guest__row count-guest__row_gap">
        Возраст
        <div class="input-count">
          <span class="input-count__sign input-count__sign_minus">&ndash;</span>
          <input type="text" value="0" min="0" max="17" class="input-count__input" name="age">
          <span class="input-count__sign input-count__sign_plus">+</span>
        </div>
      </div>
    </div>
  `);
});
$("body").on("click", ".delete-child", function () {
  $(this).closest(".count-child").remove();
});

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

import FindHint from "./components/FindHint";
new FindHint('[name="search"]');

import moment from "moment";
import data2get from "./components/data2get";

$(".find_button").on("click", function () {
  let search = $('[name="search"]').val().trim();
  let dates = $('[name="dates"]').val().trim();
  let adult = $('[name="adult"]').val();
  let childAge = [];
  $('.count-child [name="age"]').each((i, el) => {
    childAge.push($(el).val());
  });
  let child = childAge.length;

  let input_date = moment(dates.split(" - ")[0], "DD.MM.YYYY").valueOf();
  input_date = Math.floor(input_date / 1000);
  let output_date = moment(dates.split(" - ")[1], "DD.MM.YYYY").valueOf();
  output_date = Math.floor(output_date / 1000);
  let person = Number(adult) + Number(child);

  let data = { input_date, output_date, search, person };

  window.location.href = "hotels-list" + data2get(data);
});

function register() {
  var password = document.getElementById("p1").value;
  var confirm = document.getElementById("p2").value;
  var field = document.getElementById("wrong");
  if (confirm != password) {
    field.classList.add("show_aware");
  } else {
    field.classList.remove("show_aware");
  }
}
