import "../index/uikit.min";
import "../index/uikit-icons.min";

import DropMenu from "./DropMenu";
new DropMenu(".profile-menu");
let menuMobile = new DropMenu(".main__menu-mobil");
menuMobile.setBtnToggle(".main__menu-mobil img");

import Modal from "./Modal";
new Modal("#modal-logout");

import BtnRepeat from "./BtnRepeat";
new BtnRepeat("#modal-login .btn-repeat", "#modal-login .btn-login-hash");

$(".btn-logout").on("click", function (e) {
  localStorage.clear("token");
  window.location.reload();
});

import isAuth from "./isAuth";
(async () => {
  let auth = await isAuth();
  if (auth.ok) {
    $(".header-auth").show();
    $(".header-noauth").hide();

    let fio = `${auth.surname} ${auth.name} ${auth.patronymic}`;
    $(".profile-menu__link").first().text(fio);
  } else {
    $(".header-auth").hide();
    $(".header-noauth").show();
  }
})();

import ConfirmPassword from "./ConfirmPassword";
let confirmForgot = new ConfirmPassword(
  "#modal-forgot .input-code-confirm",
  "#modal-forgot .btn-confirm-password",
  {
    url: "",
  }
);

let modalLogin = new Modal("#modal-login", {
  beforeOpen: function () {
    $(".uk-navbar-dropdown.uk-open").removeClass("uk-open");
    $('.uk-navbar-toggle[aria-expanded="true"]').attr("aria-expanded", "false");
    return true;
  },
});
let modalSignin = new Modal("#modal-signin");
new Modal("#modal-forgot");

import Validation from "./Validation";
let signIn = new Validation('#modal-signin [data-page="3"]', {
  textRepeat: "Пароли не совпадают",
});
let forgot = new Validation('#modal-forgot [data-page="2"]', {
  textRepeat: "Пароли не совпадают",
});
$(".btn-forgot").on("click", function () {
  console.log(forgot.validate());
});

let confirmRegister = new ConfirmPassword(
  "#modal-signin .input-code-confirm",
  "#modal-signin .btn-confirm-password",
  {
    url: "https://wehotel.ru/handler/reg.php",
  }
);

let validateRegHash = new Validation('#modal-signin [data-page="1"]');
import { login, login_hash, reg_gen, reg_hash } from "./login";
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

      confirmRegister.data = sendData;
      confirmRegister.afterSendSuccess = (data) => {
        console.log(data);
        hash_verify2 = data.hash_verify2;
        register_login = data.login;
        debugger;
      };
      confirmRegister.afterSendError = (xhr) => {
        modalSignin.toPage(2);
        debugger;
      };
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
    login: register_login,
    password,
  };

  reg_gen(data)
    .then((data) => {
      console.log(data);
      window.location.href = "lk";
    })
    .catch((xhr) => {
      console.log(xhr);
    });
});

let confirmLogin = new ConfirmPassword(
  "#modal-login .input-code-confirm",
  "#modal-login .btn-confirm-password",
  {
    url: "https://wehotel.ru/handler/token_generation.php",
  }
);

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

      login(loginData)
        .then((data) => {
          console.log(data);
          if (data.status == "ok") {
            confirmLogin.data = loginData;
            confirmLogin.afterSendSuccess = (data) => {
              console.log(data);
              localStorage.token = data.token;
              window.location.href = "lk";
            };
            confirmLogin.afterSendError = (xhr) => {
              modalLogin.toPage(1);
            };
          }
        })
        .catch((xhr) => {
          console.error(xhr);
          modalLogin.toPage(0);
          modalLogin.$modal
            .find("input")
            .removeClass("success")
            .addClass("error");
        });
    })
    .catch((xhr) => {
      console.error(xhr);
      modalLogin.toPage(0);
      modalLogin.$modal.find("input").removeClass("success").addClass("error");
    });
});
