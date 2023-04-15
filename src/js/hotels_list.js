import "./default";
import Map from "./components/Map";
new Map(".btn-open-map");

import DropMenu from "./components/DropMenu";
new DropMenu(".filters-mobile", {
  selectorsNotClose: [".filters"],
});

import Range from "./components/Range";
new Range({
  id: "dual-range-price",
  inputMin: "price-min",
  inputMax: "price-max",
  lowerBound: 0,
  upperBound: 20000,
  minSpan: 1000,
});
new Range({
  id: "dual-range-guest-rating",
  inputMax: "guest-rating",
  lowerBound: 0,
  upperBound: 10,
  minSpan: 0,
  upper: 9,
  single: true,
});
new Range({
  id: "dual-range-location",
  inputMin: "location-min",
  inputMax: "location-max",
  lowerBound: 0,
  upperBound: 50,
  minSpan: 5,
});

import { get2data } from "./components/data2get";
import GetData from "./components/GetData";
let getData = new GetData();
getData.getHotelsListPage(get2data());

$("body").on("click", ".hotel-card__img-heart", function () {
  $(this).toggleClass("active");
});

let timerInterval = false;
$(".filters").on("change", function () {
  let query = ""; // getQueryFilter()

  if (timerInterval) clearTimeout(timerInterval);
  timerInterval = setTimeout(() => {
    getData.hotelsList(query);
  }, 500);
});
