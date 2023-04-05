import "./default";
$("body").on("click", ".booking-hotel__heart", function () {
  $(this).toggleClass("active");
});

import GuestList from "./components/GuestList";
new GuestList(
  ".booking-form__guests",
  ".booking-form__add-guest",
  ".booking-form__remove-guest",
  ".booking-form__guest"
);
