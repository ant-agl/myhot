$("body").hide();
import "./default";

import Menu from "./components/Menu";
new Menu(".main__menu-list", ".tabs-content");

import { get2data } from "./components/data2get";
if (get2data().page) {
  $(`.main__menu-item[data-target="${get2data().page}"]`).trigger("click");
}

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

$(".input-hint_dfa").on("click", () => $('[name="2fa"]').focus());

function reloadChatAnimation(close = true) {
  if (close) {
    $(".chat-preview__message").addClass(
      "chat-preview__message-clear-animation"
    );
  }
  $(".chat-preview__message").removeClass("chat-preview__message-animation");
  setTimeout(() => {
    $(".chat-preview__message").addClass("chat-preview__message-animation");
  }, 200);
}
reloadChatAnimation(false);
setInterval(reloadChatAnimation, 1000 * 8);

import Chat from "./components/chat";
new Chat("#chat .chat");
