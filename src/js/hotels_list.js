import "./default";
import "./components/search";

import DropMenu from "./components/DropMenu";
new DropMenu(".filters-mobile", {
  selectorsNotClose: [".filters"],
});

import Sorting from "./components/Sorting";
new Sorting(".hotels-sort");

import Range from "./components/Range";
new Range({
  id: "dual-range-price",
  inputMin: "price_start",
  inputMax: "price_end",
  lowerBound: 0,
  upperBound: 200000,
  minSpan: 100,
});
new Range({
  id: "dual-range-guest-rating",
  inputMax: "reviews",
  lowerBound: 0,
  upperBound: 10,
  minSpan: 0,
  upper: 0,
  single: true,
});
new Range({
  id: "dual-range-location",
  inputMin: "position_short",
  inputMax: "position_long",
  lowerBound: 0,
  upperBound: 20000,
  minSpan: 50,
});
new Range({
  id: "dual-range-location-place",
  inputMin: "availability_short",
  inputMax: "availability_long",
  lowerBound: 0,
  upperBound: 50,
  minSpan: 5,
});

import { data2get, get2data } from "./components/data2get";
import GetData from "./components/GetData";
let getData = new GetData();
getData.getHotelsListPage(get2data());

$("body").on("click", ".hotel-card__img-heart", function (e) {
  e.preventDefault();
  e.stopPropagation();

  $(this).toggleClass("active");
  let id = $(this).closest(".hotel-card").data("id");
  let get = data2get({
    hotel_id: id,
  });
  let file = "";
  if ($(this).hasClass("active")) {
    console.log("add " + id);
    file = "add_favourites.php";
  } else {
    console.log("remove " + id);
    file = "delete_favourites.php";
  }
  $.ajax({
    type: "GET",
    url: "https://bytrip.ru/handler/" + file + get,
    headers: {
      "X-Auth": localStorage.token ?? "",
    },
  });
});

let timerInterval = false;
$(".filters, .search input").on("change", function () {
  let query = get2data();
  let searchQuery = {
    input_date: query?.input_date || "",
    output_date: query?.output_date || "",
    search: query?.search || "",
    person: query?.person || "",
    adult: query?.adult || "",
    childAge: query?.childAge || "",
  };
  let filters = getQueryFilter();
  console.log(filters);
  query = { ...searchQuery, ...filters };

  if (timerInterval) clearTimeout(timerInterval);
  timerInterval = setTimeout(() => {
    getData.hotelsList(query);
  }, 500);
});

function getQueryFilter() {
  let filters = {};
  $(".filters input").each((i, el) => {
    let $el = $(el);
    let type = $el.attr("type");
    let name = $el.attr("name")?.trim();
    switch (name) {
      case "price-min":
      case "price-max":
      case "location-min":
      case "location-max":
      case "from_location":
        return;
    }
    let val = "";
    if (!name) return;
    if (type == "checkbox" || type == "radio") {
      if (!$el.prop("checked")) return;

      val = $el.val() ?? 1;
    } else {
      val = $el.val();
    }
    filters[name] = val;
    let categoryGet = $el.closest("[data-get]").data("get");
    if (categoryGet && type != "radio") filters[categoryGet] = 1;
  });
  return filters;
}

$("body").on("click", ".filter__reset", function () {
  let id = $(this).data("id");
  $(`#filter-content-${id} input`).prop("checked", false).trigger("change");
});
