"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reg_hash = reg_hash;
exports.reg_gen = reg_gen;
exports.login_hash = login_hash;
exports.login = login;
exports.forgot_hash = forgot_hash;
exports.recovery_password = recovery_password;

function reg_hash(data) {
  console.log(data);
  return new Promise(function (resolve, reject) {
    $.ajax({
      type: "POST",
      url: "https://bytrip.ru/handler/reg_hash.php",
      data: data,
      success: function success(data) {
        try {
          data = JSON.parse(data);
          resolve(data);
        } catch (e) {
          reject(e.message);
        }
      },
      error: function error(xhr) {
        reject(xhr);
      }
    });
  });
}

function reg_gen(data) {
  console.log(data);
  return new Promise(function (resolve, reject) {
    $.ajax({
      type: "POST",
      url: "https://bytrip.ru/handler/reg_gen.php",
      data: data,
      success: function success(data) {
        console.log(data);

        try {
          data = JSON.parse(data);
          resolve(data);
        } catch (e) {
          reject(e.message);
        }
      },
      error: function error(xhr) {
        reject(xhr);
      }
    });
  });
}

function login_hash(data) {
  console.log(data);
  return new Promise(function (resolve, reject) {
    $.ajax({
      type: "POST",
      url: "https://bytrip.ru/handler/login_hash.php",
      data: data,
      success: function success(data) {
        try {
          data = JSON.parse(data);
          resolve(data);
        } catch (e) {
          reject(e.message);
        }
      },
      error: function error(xhr) {
        reject(xhr);
      }
    });
  });
}

function login(data) {
  console.log(data);
  return new Promise(function (resolve, reject) {
    $.ajax({
      type: "POST",
      url: "https://bytrip.ru/handler/login.php",
      data: data,
      success: function success(data) {
        try {
          data = JSON.parse(data);
          resolve(data);
        } catch (e) {
          reject(e.message);
        }
      },
      error: function error(xhr) {
        reject(xhr);
      }
    });
  });
}

function forgot_hash(data) {
  console.log(data);
  return new Promise(function (resolve, reject) {
    $.ajax({
      type: "POST",
      url: "https://bytrip.ru/handler/recovery_hash.php",
      data: data,
      success: function success(data) {
        try {
          data = JSON.parse(data);
          resolve(data);
        } catch (e) {
          reject(e.message);
        }
      },
      error: function error(xhr) {
        reject(xhr);
      }
    });
  });
}

function recovery_password(data) {
  console.log(data);
  return new Promise(function (resolve, reject) {
    $.ajax({
      type: "POST",
      url: "https://bytrip.ru/handler/recovery_password.php",
      data: data,
      success: function success(data) {
        try {
          data = JSON.parse(data);
          resolve(data);
        } catch (e) {
          reject(e.message);
        }
      },
      error: function error(xhr) {
        reject(xhr);
      }
    });
  });
}