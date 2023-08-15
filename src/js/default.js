import "./components/header";
import "./components/WidgetChat";

import Chat from "./components/chat";
new Chat(".widget-chat__content .chat");

function changeHeightOnResize() {
  if ($(".main__subsection").length) {
    let mW = $(".main__content").outerWidth() - 320;
    if ($("body").outerWidth() <= 767) mW = "none";

    $(".main__section").css("maxWidth", mW);
  }

  let headerH =
    $(".header").outerHeight(true) + ($(".search")?.outerHeight(true) ?? 0);
  $(".main").css("min-height", $(window).outerHeight(true) - headerH);

  if ($(".main__subsection").css("overflow-y") != "auto") return;
  let hMainSection = $(window).outerHeight(true) - headerH;
  $(".main__subsection").css("max-height", hMainSection);

  hMainSection =
    $(".main__subsection").outerHeight(true) > hMainSection
      ? $(".main__subsection").outerHeight(true)
      : hMainSection;
  $(".main__section").css("max-height", hMainSection);
}
changeHeightOnResize();
if ($("body").css("display") == "none") {
  let intervalH = setInterval(() => {
    if ($("body").css("display") != "none") {
      changeHeightOnResize();
      clearInterval(intervalH);
    }
  }, 100);
}
$(window).resize(changeHeightOnResize);

import "jquery-mask-plugin";
$(".mask-phone").mask("+7 (000) 000-00-00", {
  placeholder: "+7 (___) ___-__-__",
});

$("body").on("click", ".toggle-show-password", function () {
  $(this).find("img").toggleClass("active");
  let $input = $(this).parent().find("input");
  if ($input.attr("type") == "password") $input.attr("type", "text");
  else $input.attr("type", "password");
});
