export default function scrollOverflow($elements) {
  $elements.each((i, el) => {
    const $el = $(el);

    const style = {
      borderRadius: $(el).css("borderRadius"),
      maxHeight: $(el).css("maxHeight"),
      overflowY: "auto",
      position: "relative",
    };
    $el.css({
      overflow: "hidden",
      padding: 0,
    });

    let $elScroll = $el.find(".scroll-overflow-class");
    if ($elScroll.length > 0) {
      if ($(el).css("maxHeight") != $elScroll.css("maxHeight"))
        $elScroll.css(style);
    } else {
      style.padding = $(el).css("padding");

      const scrollContent = $el.children();
      $el.html('<div class="scroll-overflow-class"></div>');
      $el.children().css(style).append(scrollContent);
    }
  });
}
