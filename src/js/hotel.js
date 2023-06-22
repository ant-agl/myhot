import "./default";
import CropText from "./components/CropText";
new CropText({
  selector: ".hotel__review-text",
  maxHeight: 54,
});

import Menu from "./components/Menu";
new Menu(".main__menu-list", ".tabs-content");

import { get2data, data2get } from "./components/data2get";
import GetData from "./components/GetData";
let hotelId = get2data().id;
let person = get2data().person || 1;
let input_date = get2data().input_date;
let output_date = get2data().output_date;
if (!hotelId && history.length > 2) history.back();
else if (!hotelId) location.href = "/";
let getData = new GetData();
getData.hotel({ hotelId, input_date, output_date, person });

import ChangeDateBlock from "./components/ChangeDateBlock";
new ChangeDateBlock(".dates-booking");

$(".btn-back").on("click", function (e) {
  e.preventDefault();
  location.href = "/hotels-list" + data2get(get2data());
});
