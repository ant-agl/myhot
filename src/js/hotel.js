import "./default";
import CropText from "./components/CropText";
new CropText({
  selector: ".hotel__review-text",
  maxHeight: 54,
});

import Menu from "./components/Menu";
new Menu(".main__menu-list", ".tabs-content");

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel";
$(".hotel__slider-for").slick({
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  fade: true,
  asNavFor: ".hotel__slider-nav",
  autoplay: true,
});
$(".hotel__slider-nav").slick({
  arrows: false,
  slidesToShow: 3,
  slidesToScroll: 1,
  asNavFor: ".hotel__slider-for",
  focusOnSelect: true,
  centerMode: true,
  centerPadding: 0,
});

import BackgroundImage from "./components/BackgroundImage";
new BackgroundImage(".hotel__slider-for__item", {
  paddingBottom: "75%",
});
new BackgroundImage(".hotel__slider-nav__item", {
  paddingBottom: "45%",
  size: "cover",
});

import { get2data } from "./components/data2get";
import GetData from "./components/GetData";
let hotelId = get2data().id;
let getData = new GetData();
getData.hotel(hotelId);

import ChangeDateBlock from "./components/ChangeDateBlock";
new ChangeDateBlock(".dates-booking");

import Modal from "./components/Modal";
new Modal("#modal-room");

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
