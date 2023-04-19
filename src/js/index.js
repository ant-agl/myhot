import "./index/uikit.min";
import "./index/uikit-icons.min";

import "jquery-mask-plugin";
$(".mask-phone").mask("+7 (000) 000-00-00", {
  placeholder: "+7 (___) ___-__-__",
});

import ConfirmPassword from "./components/ConfirmPassword";
let confirmLogin = new ConfirmPassword(
  "#modal-login .input-code-confirm",
  "#modal-login .btn-confirm-password",
  {
    url: "",
  }
);
let confirmRegister = new ConfirmPassword(
  "#modal-signin .input-code-confirm",
  "#modal-signin .btn-confirm-password",
  {
    url: "",
  }
);
let confirmForgot = new ConfirmPassword(
  "#modal-forgot .input-code-confirm",
  "#modal-forgot .btn-confirm-password",
  {
    url: "",
  }
);

import "./components/search";

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

import "air-datepicker/air-datepicker.css";
import AirDatepicker from "air-datepicker";
new AirDatepicker('#modal-signin [name="birthday"]', {
  autoClose: true,
  isMobile: window.outerWidth < 700,
  onSelect() {
    $('#modal-signin [name="birthday"]').trigger("change");
  },
});

import Modal from "./components/Modal";
new Modal("#modal-login");
new Modal("#modal-signin");
new Modal("#modal-forgot");

import Validation from "./components/Validation";
let signIn = new Validation('#modal-signin [data-page="3"]', {
  textRepeat: "Пароли не совпадают",
});
let forgot = new Validation('#modal-forgot [data-page="2"]', {
  textRepeat: "Пароли не совпадают",
});
$(".btn-signin").on("click", function () {
  console.log(signIn.validate());
});
$(".btn-forgot").on("click", function () {
  console.log(forgot.validate());
});
