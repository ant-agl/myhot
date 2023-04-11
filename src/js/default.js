function changeHeightOnResize() {
  $(".main").css(
    "min-height",
    $(window).outerHeight() - $(".header").outerHeight()
  );

  if ($(".main__subsection").css("overflow-y") != "auto") return;
  let hMainSection = $(window).outerHeight() - $(".header").outerHeight();
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

import DropMenu from "./components/DropMenu";
new DropMenu(".profile-menu");
let menuMobile = new DropMenu(".main__menu-mobil");
menuMobile.setBtnToggle(".main__menu-mobil img");

import Modal from "./components/Modal";
let modalLogout = new Modal("#modal-logout");

$(".btn-logout").on("click", function (e) {
  console.log("LOGOUT");
});
