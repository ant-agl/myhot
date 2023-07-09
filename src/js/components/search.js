import Validation from "./Validation";
let searchValid = new Validation(".search", {
  isOutputErrors: false,
});

import FindHint from "./FindHint";
new FindHint('[name="search"]');
import InputCount from "./InputCount";
new InputCount();
import DropMenu from "./DropMenu";
new DropMenu(".search__input_guests", {
  classActive: "open",
  selectorsNotClose: [".count-guest__modal", ".delete-child"],
});
$(".count-adult").on("input change", function () {
  let val = $(this).val();
  $(".count-guest__value .adult").text(val);
});
$("body").on("click", ".add-child, .delete-child", function () {
  setTimeout(() => {
    let val = $(".count-child").length;
    $(".count-guest__value .child").text(val);
  });
});
$(".add-child").on("click", function () {
  $(this).before(`
    <div class="count-guest__row count-child">
      <span class="count-guest__row delete-child">
        <img src="../img/icons/cross.png">
        Ребенок
      </span>
      <div class="count-guest__row count-guest__row_gap">
        Возраст
        <div class="input-count">
          <span class="input-count__sign input-count__sign_minus">&ndash;</span>
          <input type="text" value="0" min="0" max="17" class="input-count__input" name="age">
          <span class="input-count__sign input-count__sign_plus">+</span>
        </div>
      </div>
    </div>
  `);

  let h = $(this)
    .parent()
    .find("> *")
    .toArray()
    .reduce((sum, item) => (sum += item.clientHeight), 0);
  $(this).parent().scrollTop(h);
});
$("body").on("click", ".delete-child", function () {
  $(this).closest(".count-child").remove();
});

let getData = get2data();
let data = {};
for (let name in getData) {
  let val = decodeURIComponent(getData[name])?.trim();
  if (!name || !val) continue;
  data[name] = val;
}
$('[name="search"]').val(data.search || "");
let selectedDates = [];
if (data.input_date) selectedDates.push(data.input_date * 1000);
if (data.output_date) selectedDates.push(data.output_date * 1000);
if (selectedDates.length == 0) {
  let d = new Date();
  d = d.getTime();
  selectedDates.push(d);
  selectedDates.push(d + 3600000 * 24);
}
$('[name="adult"]')
  .val(data.adult || 1)
  .trigger("change");
if (data.childAge) {
  try {
    let childAge = JSON.parse(data.childAge);
    childAge.forEach((age) => {
      $(".add-child").trigger("click");
      $('[name="age"]').last().val(age).trigger("input");
    });
    $("body").trigger("click");
  } catch (e) {
    console.error(e.message);
  }
}

import "air-datepicker/air-datepicker.css";
import AirDatepicker from "air-datepicker";
new AirDatepicker(".search__input_dates", {
  autoClose: true,
  range: true,
  multipleDatesSeparator: " - ",
  minDate: new Date(),
  isMobile: window.outerWidth < 700,
  selectedDates,
  onSelect() {
    $(".search__input_dates").trigger("change");
  },
});

import moment from "moment";
import { data2get, get2data } from "./data2get";

$(".form-search").on("submit", function (e) {
  e.preventDefault();

  if (!searchValid.validate()) return;

  let search = $('[name="search"]').val().trim();
  let dates = $('[name="dates"]').val().trim();
  let adult = $('[name="adult"]').val();
  let childAge = [];
  $('.count-child [name="age"]').each((i, el) => {
    childAge.push($(el).val());
  });
  let child = childAge.length;
  childAge = encodeURIComponent(JSON.stringify(childAge));

  let input_date = moment(dates.split(" - ")[0], "DD.MM.YYYY").valueOf();
  input_date = Math.floor(input_date / 1000);
  let output_date = moment(dates.split(" - ")[1], "DD.MM.YYYY").valueOf();
  output_date = Math.floor(output_date / 1000);
  console.log(input_date, output_date);
  let person = Number(adult) + Number(child);

  let data = { input_date, output_date, search, person, adult, childAge };

  let link = "";
  if (window.location.pathname.includes("hotels-list")) link = "./";
  else link = "./hotels-list";
  window.location.href = link + data2get(data);
});

$("body").on("keydown", function (e) {
  if (e.keyCode === 13) {
    if ($(".modal_open").length == 0 && $(".find-hint.active").length == 0) {
      $(".search__button").eq(0).trigger("click");
    }
  }
});
