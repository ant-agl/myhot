import "./default";

import Menu from "./components/Menu";
new Menu(".main__menu-list", ".tabs-content");

import "air-datepicker/air-datepicker.css";
import AirDatepicker from "air-datepicker";
import moment from "moment";

let birthday = new AirDatepicker("#date", {
  autoClose: true,
  position: "bottom center",
  isMobile: $(window).outerWidth() <= 767,
  maxDate: moment().subtract(18, "years"),
});
$(window).resize(() => {
  let w = $(window).outerWidth();
  birthday.update({
    isMobile: w <= 767,
  });
});

import GetData from "./components/GetData";
let getData = new GetData();
getData.getLk({
  user: birthday,
});

import "./components/profile";
