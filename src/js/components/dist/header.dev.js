"use strict";

require("../index/uikit.min");

require("../index/uikit-icons.min");

var _DropMenu = _interopRequireDefault(require("./DropMenu"));

var _Modal = _interopRequireDefault(require("./Modal"));

var _moment = _interopRequireDefault(require("moment"));

require("air-datepicker/air-datepicker.css");

var _airDatepicker2 = _interopRequireDefault(require("air-datepicker"));

var _BtnRepeat = _interopRequireDefault(require("./BtnRepeat"));

var _isAuth = _interopRequireDefault(require("./isAuth"));

var _ConfirmPassword = _interopRequireDefault(require("./ConfirmPassword"));

var _Validation = _interopRequireDefault(require("./Validation"));

var _login = require("./login");

var _scrollOverflow = _interopRequireDefault(require("./scrollOverflow"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

new _DropMenu["default"](".profile-menu");
var menuMobile = new _DropMenu["default"](".main__menu-mobil");
menuMobile.setBtnToggle(".main__menu-mobil img");
var modalText = new _Modal["default"]("#modal-text");
new _Modal["default"]("#modal-logout");
new _airDatepicker2["default"]('#modal-signin [name="date"]', {
  autoClose: true,
  maxDate: (0, _moment["default"])(new Date()).subtract(14, "years"),
  isMobile: window.outerWidth < 700,
  onSelect: function onSelect() {
    $('#modal-signin [name="date"]').trigger("change");
  }
});
new _BtnRepeat["default"]("#modal-login .btn-repeat", "#modal-login .btn-login-hash");
new _BtnRepeat["default"]("#modal-signin .btn-repeat", "#modal-signin .btn-reg-hash");
new _BtnRepeat["default"]("#modal-forgot .btn-repeat", "#modal-forgot .btn-hash-forgot");
$(".btn-logout").on("click", function (e) {
  document.cookie = "token=; path=/; max-age=-1";
  localStorage.clear("token");
  window.location.reload();
});

(function _callee() {
  var auth, fio;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap((0, _isAuth["default"])());

        case 2:
          auth = _context.sent;

          if (auth.ok) {
            $(".header-auth").show();
            $(".header-noauth").hide();
            fio = "".concat(auth.surname, " ").concat(auth.name);
            $(".profile-menu__link").first().text(fio);
            if (auth.pre_reserve) $(".profile-menu__item_booking").show();else $(".profile-menu__item_booking").hide();
          } else {
            $(".header-auth").hide();
            $(".header-noauth").show();
          }

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
})();

var modalLogin = new _Modal["default"]("#modal-login", {
  closeToBackground: false,
  beforeOpen: function beforeOpen() {
    $(".uk-navbar-dropdown.uk-open").removeClass("uk-open");
    $('.uk-navbar-toggle[aria-expanded="true"]').attr("aria-expanded", "false");
    return true;
  }
});
var modalSignin = new _Modal["default"]("#modal-signin", {
  closeToBackground: false
});
var modalForgot = new _Modal["default"]("#modal-forgot", {
  closeToBackground: false
});
var signIn = new _Validation["default"]('#modal-signin [data-page="2"]', {
  textRepeat: "Пароли не совпадают"
});
var forgot = new _Validation["default"]('#modal-forgot [data-page="2"]', {
  textRepeat: "Пароли не совпадают"
});
var confirmRegister = new _ConfirmPassword["default"]("#modal-signin .input-code-confirm", "#modal-signin .btn-confirm-password", {
  url: "https://wehotel.ru/handler/reg.php"
});
console.log($('#modal-signin [data-page="0"]'));
var validateRegHash = new _Validation["default"]('#modal-signin [data-page="0"]');
var hash_verify, hash_verify2, register_login;
$("body").on("click", "#modal-signin .btn-reg-hash", function () {
  if (!validateRegHash.validate()) return;
  var data = {};
  $("#modal-signin input").each(function (i, el) {
    var name = $(el).attr("name");
    var val = $(el).val().trim();

    if (name == "phone") {
      val = val.replace(/\D/g, "");
      val = 7 + val.slice(1);
    }

    data[name] = val;
  });
  (0, _login.reg_hash)(data).then(function (getData) {
    modalSignin.toPage(1);
    console.log(getData);
    hash_verify = getData.hash_verify;
    var sendData = {
      phone: data.phone,
      hash_verify: hash_verify
    };
    confirmRegister.data = sendData;

    confirmRegister.afterSendSuccess = function (data) {
      modalSignin.toPage(2);
      console.log(data);
      hash_verify2 = data.hash_verify2;
      register_login = data.login;
    };

    confirmRegister.afterSendError = function (xhr) {
      modalSignin.toPage(1);
    };
  })["catch"](function (xhr) {
    console.error(xhr);
    var data = JSON.parse(xhr.responseText);

    switch (xhr.status) {
      case 403:
        $("#modal-text .modal__title").text(data.description);
        modalSignin.$modal.find('[name="phone"]').addClass("error").removeClass("success");
        break;

      default:
        $("#modal-text .modal__title").text("Что-то пошло не так");
        break;
    }

    modalText.open();
  });
});
$("body").on("click", "#modal-signin .btn-signin", function () {
  var password = $('#modal-signin [name="password"]').val().trim();

  if (!signIn.validate() || !hash_verify || !hash_verify2 || !register_login || !password) {
    return;
  }

  var data = {
    hash_verify: hash_verify,
    hash_verify2: hash_verify2,
    login: register_login,
    password: password
  };
  (0, _login.reg_gen)(data).then(function (data) {
    console.log(data);
    document.cookie = "token=".concat(data.token, "; path=/; max-age=").concat(60 * 60 * 24 * 3, ";");
    localStorage.token = data.token;
    setTimeout(function () {
      window.location.href = "/lk";
    }, 500);
  })["catch"](function (xhr) {
    console.log(xhr);
  });
});
var confirmLogin = new _ConfirmPassword["default"]("#modal-login .input-code-confirm", "#modal-login .btn-confirm-password", {
  url: "https://wehotel.ru/handler/token_generation.php"
});
var validateLoginHash = new _Validation["default"]('#modal-login [data-page="0"]');
var loginData = {
  hash_verify: undefined,
  login: undefined
};
$("body").on("click", "#modal-login .btn-login-hash", function () {
  if (!validateLoginHash.validate()) return;
  var data = {};
  $("#modal-login input").each(function (i, el) {
    var name = $(el).attr("name");
    var val = $(el).val().trim();

    if (name == "login") {
      val = val.replace(/\D/g, "");
      val = 7 + val.slice(1);
    }

    data[name] = val;
  });
  (0, _login.login_hash)(data).then(function (data) {
    console.log(data);
    loginData.login = data.login;
    loginData.hash_verify = data.hash_verify;
    var is2fa = data["2fa"] != 0;
    (0, _login.login)(loginData).then(function (data) {
      console.log(data);

      if (data.status == "ok") {
        if (!is2fa) {
          modalLogin.close();
          document.cookie = "token=".concat(data.token, "; path=/; max-age=").concat(60 * 60 * 24 * 3, ";");
          localStorage.token = data.token;
          setTimeout(function () {
            window.location.href = "/lk";
          }, 500);
        } else {
          modalLogin.toPage(1);
        }

        confirmLogin.data = loginData;

        confirmLogin.afterSendSuccess = function (data) {
          console.log(data);
          document.cookie = "token=".concat(data.token, "; path=/; max-age=").concat(60 * 60 * 24 * 3, ";");
          localStorage.token = data.token;
          setTimeout(function () {
            window.location.href = "/lk";
          }, 500);
        };

        confirmLogin.afterSendError = function (xhr) {
          modalLogin.toPage(1);
        };
      }
    })["catch"](function (xhr) {
      console.error(xhr);
      modalLogin.toPage(0);
      modalLogin.$modal.find("input").removeClass("success").addClass("error");
    });
  })["catch"](function (xhr) {
    console.error(xhr);
    modalLogin.toPage(0);
    modalLogin.$modal.find("input").removeClass("success").addClass("error");
  });
});
var validateHashForgot = new _Validation["default"]('#modal-forgot [data-page="0"]');
var confirmForgot = new _ConfirmPassword["default"]("#modal-forgot .input-code-confirm", "#modal-forgot .btn-confirm-password", {
  url: "https://wehotel.ru/handler/recovery_code.php"
});
var forgotObj = {};
$("body").on("click", "#modal-forgot .btn-hash-forgot", function () {
  if (!validateHashForgot.validate()) return;
  var login = $('#modal-forgot [name="login"]').val().trim();
  login = login.replace(/\D/g, "");
  login = 7 + login.slice(1);
  (0, _login.forgot_hash)({
    login: login
  }).then(function (getData) {
    console.log(getData);
    forgotObj.hash = getData.hash_verify;
    forgotObj.login = login;
    var sendData = {
      login: login,
      hash: forgotObj.hash
    };
    confirmForgot.data = sendData;

    confirmForgot.afterSendSuccess = function (data) {
      console.log(data);
      forgotObj.hash_verify = data.hash_verify;
      forgotObj.code = data.code;
    };

    confirmForgot.afterSendError = function (xhr) {
      modalForgot.toPage(1);
    };
  })["catch"](function (xhr) {
    console.error(xhr);
  });
});
$("body").on("click", "#modal-forgot .btn-forgot", function () {
  var password = $('#modal-forgot [name="password"]').val().trim();

  if (!forgot.validate() || !forgotObj.hash_verify || !forgotObj.login || !forgotObj.code || !password) {
    return;
  }

  var data = {
    hash_verify: forgotObj.hash_verify,
    login: forgotObj.login,
    code: forgotObj.code,
    password: password
  };
  (0, _login.recovery_password)(data).then(function (data) {
    console.log(data);
    $("#modal-forgot").removeClass("modal_open");
    $("#modal-login").addClass("modal_open");
  })["catch"](function (xhr) {
    console.log(xhr);
  });
});
(0, _scrollOverflow["default"])($("#modal-login .modal__content"));
(0, _scrollOverflow["default"])($("#modal-signin .modal__content"));
(0, _scrollOverflow["default"])($("#modal-forgot .modal__content"));
$("body").keyup(function (e) {
  if (e.keyCode === 13) {
    debugger;
    $(".modal__page.active button").last().trigger("click");
  }
});