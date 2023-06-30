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
      position: "relative"
    };
    $el.css({
      overflow: "hidden",
      padding: 0
    });
    var $elScroll = $el.find(".scroll-overflow-class");

    if ($elScroll.length > 0) {
      $elScroll.css("maxHeight", "none");
      setTimeout(function () {
        if ($(el).css("height") != $elScroll.css("height")) $elScroll.css("maxHeight", $(el).css("maxHeight"));
      });
    } else {
      style.padding = $(el).css("padding");
      var scrollContent = $el.children();
      $el.html('<div class="scroll-overflow-class"></div>');
      $el.children().css(style).append(scrollContent);
    }
  });
}