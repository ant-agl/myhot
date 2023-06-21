import DropMenu from "./DropMenu";
new DropMenu(".widget-chat", {
  classActive: "open",
  selectorsNotClose: [".widget-chat__content"],
});

// $(".widget-chat").on("click", function () {
//   $(this).toggleClass("open");
// });
