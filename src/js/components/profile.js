import Modal from "./Modal";
let modalText = new Modal("#modal-text");

import ConfirmPassword from "./ConfirmPassword.js";
import Validation from "./Validation";

let confirmPass = new ConfirmPassword(
  "#modal-confirm-password .input-code-confirm",
  "#modal-confirm-password .btn-confirm-password",
  { url: "https://bytrip.ru/handler/code_check.php" }
);
let confirmPassDelete = new ConfirmPassword(
  "#modal-confirm-delete .input-code-confirm",
  "#modal-confirm-delete .btn-confirm-delete",
  { url: "https://bytrip.ru/handler/delete_account_confirm.php" }
);
let modalConfirm = new Modal("#modal-confirm-password", {
  beforeOpen: () => {
    confirmPass.clearAll();
    confirmPass.focusFirst();
    return true;
  },
});
let modalConfirmDelete = new Modal("#modal-confirm-delete", {
  beforeOpen: () => {
    confirmPassDelete.clearAll();
    confirmPassDelete.focusFirst();
    return true;
  },
});
confirmPass.afterSendSuccess = (data) => {
  setTimeout(() => {
    modalConfirm.close();

    if (data === "") return;
    console.log(data);
    let token = data.token;
    document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 3}`;
    localStorage.token = token;
  }, 750);
};
confirmPassDelete.afterSendSuccess = () => {
  setTimeout(() => {
    document.cookie = `token=; path=/; max-age=-1`;
    localStorage.clear("token");
    location.href = "/";
  }, 750);
};

let valid = new Validation("#user-data");
$(".input").prop("disabled", true);
$(".change-data").on("click", function () {
  if (!$(this).hasClass("active")) {
    $('[name="change_pass"]').val("").attr("type", "password");

    $(".change-data-background").remove();
    $("body").append('<div class="change-data-background"></div>');
  } else {
    console.log(valid.validate());
    if (!valid.validate()) return;
    $('[name="change_pass"]').attr("type", "text");
    let $bg = $(".change-data-background");
    $bg.addClass("remove");
    setTimeout(() => {
      $bg.remove();
    }, 200);
  }
  $(this).toggleClass("active");
  $(".btn-delete-account").toggleClass("active");
  $(".input").prop("disabled", !$(this).hasClass("active"));

  // if (!$(".email-hint").hasClass("input-hint__not-active")) {
  //   $(".btn-mail-confirm").toggleClass("active");
  // } else {
  //   $(".btn-mail-confirm").removeClass("active");
  // }
});

$(".change-data").on("click", function () {
  if ($(this).hasClass("active")) return;
  if (!valid.validate()) return;

  let dfa = $('[name="2fa"]').data("last-value");

  let placeMessage = "";
  switch (dfa) {
    case "mail":
      placeMessage = "на вашу почту";
      break;
    case "phone":
      placeMessage = "на ваш телефон";
      break;
    case "app":
      placeMessage = "в пуш уведомлении";
      break;
  }
  $(".modal__desc span").text(placeMessage);

  let fio = [];

  let data = {};
  var formData = new FormData();
  $(".input").each((i, item) => {
    let name = $(item).attr("name");
    let val = $(item).val()?.trim();
    let lastVal = $(item).data("last-value");
    if (name == "change_pass" && val) {
      data[name] = val;
      formData.append(name, val);
    } else if (name == "image" && val) {
      formData.append(name, $(item)[0].files[0]);
    } else if (val && val != lastVal) {
      if (name == "phone") val = val.replace(/\D/g, "");

      data[name] = val;
      formData.append(name, val);
      $(item).data("last-value", val);
    }
    switch (name) {
      case "surname":
      case "name":
      case "second_name":
        fio.push(val);
        break;
    }
  });
  $(".profile-menu__link").first().text(fio.join(" "));

  if (data.change_pass) {
    $('[name="change_pass"]')
      .val("Был изменен сегодня")
      .data("last-value", "Был изменен сегодня");
  } else {
    let lastVal = $('[name="change_pass"]').data("last-value");
    $('[name="change_pass"]').val(lastVal);
  }

  $(".msg").addClass("active");
  setTimeout(() => {
    $(".msg").removeClass("active");
  }, 1500);

  if (dfa != "no") {
    if (data["2fa"] || data.phone || data.change_pass) {
      modalConfirm.open();
    }
  } else if (data.email) {
    modalConfirm.open();
  }
  if (data.email) {
    $(".email-hint").removeClass("input-hint__not-active");
  }

  console.log(data);
  $.ajax({
    type: "POST",
    url: "https://bytrip.ru/handler/change_info.php",
    headers: {
      "X-Auth": localStorage.token ?? "",
    },
    data: formData,
    contentType: false,
    processData: false,
    success: (data) => {
      if (data === "") return;
      data = JSON.parse(data);
      console.log(data);
      let token = data.token;
      document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 3}`;
      localStorage.token = token;
    },
    error: (xhr) => {
      console.log(xhr);
    },
  });
});

// $(".input-avatar").on("change", function () {
//   let file = this.files[0];
//   let reader = new FileReader();
//   reader.readAsDataURL(file);
//   reader.onloadend = function () {
//     $(".main__photo-img").attr("src", reader.result);
//   };
// });

$(".btn-delete-account").on("click", function () {
  console.log("delete account");
  modalConfirmDelete.open();

  $.ajax({
    type: "GET",
    url: "https://bytrip.ru/handler/delete_account.php",
    headers: {
      "X-Auth": localStorage.token ?? "",
    },
    success: () => {
      confirmPassDelete.afterSendError = (xhr) => {
        $("#modal-text .modal__title").text("Что-то пошло не так");
        modalText.open();
      };
    },
    error: () => {
      $("#modal-text .modal__title").text("Что-то пошло не так");
      modalText.open();
    },
  });
});

$(".btn-mail-confirm").on("click", function () {
  $.ajax({
    type: "GET",
    url: "https://bytrip.ru/handler/email_confirm.php",
    headers: {
      "X-Auth": localStorage.token ?? "",
    },
    success: () => {
      $("#modal-text .modal__title").text("Вам на почту отправлено письмо");
      $(".email-hint").addClass("input-hint__not-active");
      modalText.open();
    },
    error: () => {
      $("#modal-text .modal__title").text("Что-то пошло не так");
      modalText.open();
    },
  });
});

$("body").keyup(function (e) {
  if (e.keyCode === 13) {
    console.log($(".change-data.active"));
    $(".change-data.active").trigger("click");
  }
});

let modalAvatar = new Modal("#modal-avatar", {
  closeToBackground: false,
});

import "cropperjs/dist/cropper.css";
import Cropper from "cropperjs";
let cropper;

$('[name="image"]').on("change", function () {
  let file = this.files[0];
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = function () {
    $("#crop-avatar").attr("src", reader.result);

    cropper = new Cropper($("#crop-avatar")[0], {
      aspectRatio: 1 / 1,
      viewMode: 2,
    });

    modalAvatar.open();
  };
});

$(".btn-save-avatar").on("click", function () {
  let croppedCanvas = cropper.getCroppedCanvas();
  let roundedCanvas = getRoundedCanvas(croppedCanvas);

  // Show
  let url = roundedCanvas.toDataURL();
  $(".main__photo-img").attr("src", url);

  roundedCanvas.toBlob(function (blob) {
    let dt = new DataTransfer();
    dt.items.add(new File([blob], "avatar.jpg")); //, {type: 'text/plain'}
    let file_list = dt.files;

    console.log("Коллекция файлов создана:");
    console.dir(file_list);

    // Вставим созданную коллекцию в реальное поле:
    document.querySelector('[name="image"]').files = file_list;
  });

  modalAvatar.close();
});

function getRoundedCanvas(sourceCanvas) {
  var canvas = document.createElement("canvas");
  var context = canvas.getContext("2d");
  var width = sourceCanvas.width;
  var height = sourceCanvas.height;

  canvas.width = width;
  canvas.height = height;
  context.imageSmoothingEnabled = true;
  context.drawImage(sourceCanvas, 0, 0, width, height);
  context.globalCompositeOperation = "destination-in";
  context.beginPath();
  context.arc(
    width / 2,
    height / 2,
    Math.min(width, height) / 2,
    0,
    2 * Math.PI,
    true
  );
  context.fill();
  return canvas;
}
