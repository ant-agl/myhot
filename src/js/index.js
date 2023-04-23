import "./index/uikit.min";
import "./index/uikit-icons.min";

import "jquery-mask-plugin";
$(".mask-phone").mask("+7 (000) 000-00-00", {
  placeholder: "+7 (___) ___-__-__",
});

import ConfirmPassword from "./components/ConfirmPassword";
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
new AirDatepicker('#modal-signin [name="date"]', {
  autoClose: true,
  maxDate: moment(new Date()).subtract(18, "years"),
  isMobile: window.outerWidth < 700,
  onSelect() {
    $('#modal-signin [name="date"]').trigger("change");
  },
});

import Modal from "./components/Modal";
let modalLogin = new Modal("#modal-login", {
  beforeOpen: function () {
    $(".uk-navbar-dropdown.uk-open").removeClass("uk-open");
    $('.uk-navbar-toggle[aria-expanded="true"]').attr("aria-expanded", "false");
    return true;
  },
});
let modalSignin = new Modal("#modal-signin");
new Modal("#modal-forgot");

import Validation from "./components/Validation";
let signIn = new Validation('#modal-signin [data-page="3"]', {
  textRepeat: "Пароли не совпадают",
});
let forgot = new Validation('#modal-forgot [data-page="2"]', {
  textRepeat: "Пароли не совпадают",
});
$(".btn-forgot").on("click", function () {
  console.log(forgot.validate());
});

let validateRegHash = new Validation('#modal-signin [data-page="1"]');
import { login, login_hash, reg_gen, reg_hash } from "./components/login";
import moment from "moment";
let hash_verify, hash_verify2, register_login;
$("#modal-signin .btn-reg-hash").on("click", function () {
  if (!validateRegHash.validate()) return;
  let data = {};
  $("#modal-signin input").each((i, el) => {
    let name = $(el).attr("name");
    let val = $(el).val().trim();
    if (name == "phone") {
      val = val.replace(/\D/g, "");
      val = 7 + val.slice(1);
    }
    data[name] = val;
  });

  reg_hash(data)
    .then((getData) => {
      console.log(getData);
      hash_verify = getData.hash_verify;

      let sendData = {
        phone: data.phone,
        hash_verify,
      };

      let confirmRegister = new ConfirmPassword(
        "#modal-signin .input-code-confirm",
        "#modal-signin .btn-confirm-password",
        {
          url: "https://wehotel.ru/handler/reg.php",
          data: sendData,
          afterSendSuccess: (data) => {
            console.log(data);
            hash_verify2 = data.hash_verify2;
            register_login = data.login;
          },
          afterSendError: (xhr) => {
            modalSignin.toPage(2);
          },
        }
      );
    })
    .catch((xhr) => {
      console.error(xhr);
    });
});

$("#modal-signin .btn-signin").on("click", function () {
  let password = $('#modal-signin [name="password"]').val().trim();
  if (
    !signIn.validate() ||
    !hash_verify ||
    !hash_verify2 ||
    !register_login ||
    !password
  ) {
    return;
  }
  let data = {
    hash_verify,
    hash_verify2,
    login,
    password,
  };

  reg_gen(data).then((data) => {
    console.log(data);
  });
});

let validateLoginHash = new Validation('#modal-login [data-page="0"]');
let loginData = {
  hash_verify: undefined,
  login: undefined,
};
$("#modal-login .btn-login-hash").on("click", function () {
  if (!validateLoginHash.validate()) return;

  let data = {};
  $("#modal-login input").each((i, el) => {
    let name = $(el).attr("name");
    let val = $(el).val().trim();
    if (name == "login" && !val.includes("@")) {
      val = val.replace(/\D/g, "");
      val = 7 + val.slice(1);
    }
    data[name] = val;
  });

  login_hash(data)
    .then((data) => {
      console.log(data);
      loginData.login = data.login;
      loginData.hash_verify = data.hash_verify;

      login(loginData).then((data) => {
        console.log(data);
        if (data.status == "ok") {
          let confirmLogin = new ConfirmPassword(
            "#modal-login .input-code-confirm",
            "#modal-login .btn-confirm-password",
            {
              url: "https://wehotel.ru/handler/token_generation.php",
              data: loginData,
              afterSendSuccess: (data) => {
                console.log(data);
              },
              afterSendError: (xhr) => {
                modalLogin.toPage(1);
              },
            }
          );
        }
      });
    })
    .catch((xhr) => {
      console.error(xhr);
    });
});
