"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = scrollOverflow;

function scrollOverflow($elements) {
  $elements.each(function (i, el) {
    var $el = $(el);
    var style = {
      borderRadius: $(el).css("borderRadius"),
      maxHeight: $(el).css("maxHeight"),
      overflowY: "auto",
      padding: $(el).css("padding"),
      position: "relative"
    };
    $el.css({
      overflow: "hidden",
      padding: 0
    });
    var scrollContent = $el.children();
    $el.html("<div></div>");
    $el.children().css(style).append(scrollContent);
  });
}