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
  selectorsNotClose: [".count-guest__modal"],
});

import InputCount from "./components/InputCount";
new InputCount();

$(".count-adult").on("input change", function () {
  let val = $(this).val();
  $(".count-guest__value .adult").text(val);
});
$(".count-child").on("input change", function () {
  let val = $(this).val();
  $(".count-guest__value .child").text(val);
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
