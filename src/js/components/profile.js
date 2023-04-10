import Modal from "./Modal";
import ConfirmPassword from "./ConfirmPassword.js";

let confirmPass = new ConfirmPassword(
  ".input-code-confirm",
  ".btn-confirm-password"
);
let modalConfirm = new Modal("#modal-confirm-password", {
  beforeOpen: () => {
    confirmPass.clearAll();
    confirmPass.focusFirst();
    return true;
  },
});
confirmPass.afterSendSuccess = () => {
  setTimeout(() => {
    modalConfirm.close();
  }, 750);
};

$(".input").prop("disabled", true);
$(".change-data").on("click", function () {
  $(this).toggleClass("active");
  $(".input").prop("disabled", !$(this).hasClass("active"));
  if ($(this).hasClass("active")) {
    $('[name="change_pass"]').val("").attr("type", "password");

    $(".change-data-background").remove();
    $("body").append('<div class="change-data-background"></div>');
  } else {
    $('[name="change_pass"]').attr("type", "text");
    let $bg = $(".change-data-background");
    $bg.addClass("remove");
    setTimeout(() => {
      $bg.remove();
    }, 200);
  }
});

$(".change-data").on("click", function () {
  if ($(this).hasClass("active")) return;
  let dfo = $('[name="dfo"]').data("last-value");
  console.log(dfo);

  let placeMessage = "";
  switch (dfo) {
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
      if (name == "number") val = val.replace(/\D/g, "");

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
  $(".profile-menu__item a").first().text(fio.join(" "));

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

  if (dfo != "no") {
    if (data.dfo || data.number || data.change_pass) {
      modalConfirm.open();
    }
  }
  if (data.email) {
    $(".email-hint").removeClass("input-hint__not-active");
  }

  console.log(data);
  $.ajax({
    type: "POST",
    url: "https://wehotel.ru/handler/change_info.php",
    data: formData,
    contentType: false,
    processData: false,
    success: (data) => {
      console.log(data);
    },
    error: (xhr) => {
      console.log(xhr);
    },
  });
});

$(".input-avatar").on("change", function () {
  let file = this.files[0];
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = function () {
    $(".main__photo-img").attr("src", reader.result);
  };
});
