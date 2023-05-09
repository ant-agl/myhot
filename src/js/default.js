import "./components/header";

function changeHeightOnResize() {
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
