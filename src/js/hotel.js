import "./default";
import BackgroundImage from "./components/BackgroundImage";
import CropText from "./components/CropText";
new CropText({
  selector: ".hotel__review-text",
  maxHeight: 54,
});

import Menu from "./components/Menu";
new Menu(".main__menu-list", ".tabs-content");

import { get2data } from "./components/data2get";
import GetData from "./components/GetData";
let hotelId = get2data().id;
let input_date = get2data().input_date;
let output_date = get2data().output_date;
if (!hotelId && history.length > 2) history.back();
else if (!hotelId) location.href = "/";
let getData = new GetData();
getData.hotel({ hotelId, input_date, output_date });

import ChangeDateBlock from "./components/ChangeDateBlock";
new ChangeDateBlock(".dates-booking");

import Modal from "./components/Modal";
new Modal("#modal-room");

import scrollOverflow from "./components/scrollOverflow";
scrollOverflow($("#modal-room .modal__content"));

import ShowAll from "./components/ShowAll";
new ShowAll("paid-service", {
  minShowElements: 0,
  gap: 0,
  textShow: "Выберете платные услуги —",
  textHide: "Выберете платные услуги +",
});

import CheckboxSum from "./components/CheckboxSum";
let cSum = new CheckboxSum(
  ".modal-room__paid-list",
  ".modal-room__paid-total-value"
);
cSum.updateAnswer();

new BackgroundImage(".modal-room__main-img", {
  paddingBottom: "40%",
  size: "cover",
});
new BackgroundImage(".modal-room__second-img", {
  paddingBottom: "20%",
  size: "cover",
});
