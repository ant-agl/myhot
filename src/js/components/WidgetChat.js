import DropMenu from "./DropMenu";
new DropMenu(".widget-chat", {
  classActive: "open",
  selectorsNotClose: [".widget-chat__content"],
});
