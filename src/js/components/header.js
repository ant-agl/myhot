import "../index/uikit.min";
import "../index/uikit-icons.min";

import DropMenu from "./DropMenu";
new DropMenu(".profile-menu");
let menuMobile = new DropMenu(".main__menu-mobil");
menuMobile.setBtnToggle(".main__menu-mobil img");

import Modal from "./Modal";
new Modal("#modal-logout");

import moment from "moment";
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

import BtnRepeat from "./BtnRepeat";
new BtnRepeat("#modal-login .btn-repeat", "#modal-login .btn-login-hash");
new BtnRepeat("#modal-signin .btn-repeat", "#modal-signin .btn-reg-hash");
new BtnRepeat("#modal-forgot .btn-repeat", "#modal-forgot .btn-hash-forgot");

$(".btn-logout").on("click", function (e) {
  document.cookie = `token=; path=/; max-age=-1`;
  localStorage.clear("token");
  window.location.reload();
});

import isAuth from "./isAuth";
(async () => {
  let auth = await isAuth();
  if (auth.ok) {
    $(".header-auth").show();
    $(".header-noauth").hide();

    let fio = `${auth.surname} ${auth.name}`;
    $(".profile-menu__link").first().text(fio);

    if (auth.pre_reserve) $(".profile-menu__item_booking").show();
    else $(".profile-menu__item_booking").hide();
  } else {
    $(".header-auth").hide();
    $(".header-noauth").show();
  }
})();

import ConfirmPassword from "./ConfirmPassword";

let modalLogin = new Modal("#modal-login", {
  closeToBackground: false,
  beforeOpen: function () {
    $(".uk-navbar-dropdown.uk-open").removeClass("uk-open");
    $('.uk-navbar-toggle[aria-expanded="true"]').attr("aria-expanded", "false");
    return true;
  },
});
let modalSignin = new Modal("#modal-signin", { closeToBackground: false });
let modalForgot = new Modal("#modal-forgot", { closeToBackground: false });

import Validation from "./Validation";
let signIn = new Validation('#modal-signin [data-page="3"]', {
  textRepeat: "Пароли не совпадают",
});
let forgot = new Validation('#modal-forgot [data-page="2"]', {
  textRepeat: "Пароли не совпадают",
});

let confirmRegister = new ConfirmPassword(
  "#modal-signin .input-code-confirm",
  "#modal-signin .btn-confirm-password",
  {
    url: "https://wehotel.ru/handler/reg.php",
  }
);

let validateRegHash = new Validation('#modal-signin [data-page="1"]');
import {
  login,
  login_hash,
  reg_gen,
  reg_hash,
  forgot_hash,
  recovery_password,
} from "./login";
let hash_verify, hash_verify2, register_login;
$("body").on("click", "#modal-signin .btn-reg-hash", function () {
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
      };
      confirmRegister.afterSendError = (xhr) => {
        modalSignin.toPage(2);
      };
    })
    .catch((xhr) => {
      modalSignin.toPage(1);
      console.error(xhr);
    });
});

$("body").on("click", "#modal-signin .btn-signin", function () {
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
      document.cookie = `token=${data.token}; path=/; max-age=${
        60 * 60 * 24 * 3
      };`;
      localStorage = data.token;
      setTimeout(() => {
        window.location.href = "/lk";
      }, 10);
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
$("body").on("click", "#modal-login .btn-login-hash", function () {
  if (!validateLoginHash.validate()) return;

  let data = {};
  $("#modal-login input").each((i, el) => {
    let name = $(el).attr("name");
    let val = $(el).val().trim();
    if (name == "login") {
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
              document.cookie = `token=${data.token}; path=/; max-age=${
                60 * 60 * 24 * 3
              };`;
              localStorage = data.token;
              setTimeout(() => {
                window.location.href = "/lk";
              }, 10);
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

let validateHashForgot = new Validation('#modal-forgot [data-page="0"]');
let confirmForgot = new ConfirmPassword(
  "#modal-forgot .input-code-confirm",
  "#modal-forgot .btn-confirm-password",
  {
    url: "https://wehotel.ru/handler/recovery_code.php",
  }
);
let forgotObj = {};
$("body").on("click", "#modal-forgot .btn-hash-forgot", function () {
  if (!validateHashForgot.validate()) return;
  let login = $('#modal-forgot [name="login"]').val().trim();
  login = login.replace(/\D/g, "");
  login = 7 + login.slice(1);

  forgot_hash({ login })
    .then((getData) => {
      console.log(getData);
      forgotObj.hash = getData.hash_verify;
      forgotObj.login = login;

      let sendData = {
        login,
        hash: forgotObj.hash,
      };

      confirmForgot.data = sendData;
      confirmForgot.afterSendSuccess = (data) => {
        console.log(data);
        forgotObj.hash_verify = data.hash_verify;
        forgotObj.code = data.code;
      };
      confirmForgot.afterSendError = (xhr) => {
        modalForgot.toPage(1);
      };
    })
    .catch((xhr) => {
      console.error(xhr);
    });
});
$("body").on("click", "#modal-forgot .btn-forgot", function () {
  let password = $('#modal-forgot [name="password"]').val().trim();
  if (
    !forgot.validate() ||
    !forgotObj.hash_verify ||
    !forgotObj.login ||
    !forgotObj.code ||
    !password
  ) {
    return;
  }
  let data = {
    hash_verify: forgotObj.hash_verify,
    login: forgotObj.login,
    code: forgotObj.code,
    password,
  };

  recovery_password(data)
    .then((data) => {
      console.log(data);
      $("#modal-forgot").removeClass("modal_open");
      $("#modal-login").addClass("modal_open");
    })
    .catch((xhr) => {
      console.log(xhr);
    });
});

import scrollOverflow from "./scrollOverflow";
scrollOverflow($("#modal-login .modal__content"));
scrollOverflow($("#modal-signin .modal__content"));
scrollOverflow($("#modal-forgot .modal__content"));
