import "./index/uikit.min";
import "./index/uikit-icons.min";

import "jquery-mask-plugin";
$(".mask-phone").mask("+7 (000) 000-00-00", {
  placeholder: "+7 (___) ___-__-__",
});

$('input[type="number"]').keydown(function (e) {
  $(this).val("");
});

$('input[type="number"]').keyup(function (e) {
  var $wrap = $(this).closest("#code");
  var $inputs = $wrap.find('input[type="number"]');
  var val = $(this).val();

  // Ввод только цифр
  if (val == val.replace(/[0-9]/, "")) {
    $(this).val("");
    return false;
  }

  // Передача фокуса следующему innput
  $inputs.eq($inputs.index(this) + 1).focus();

  // Заполнение input hidden
  var fullval = "";
  $inputs.each(function () {
    fullval = fullval + (parseInt($(this).val()) || "0");
  });
  $wrap.find('input[type="hidden"]').val(fullval);
});

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
