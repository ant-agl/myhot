export default function scrollOverflow($elements) {
  $elements.each((i, el) => {
    const $el = $(el);
    const style = {
      borderRadius: $(el).css("borderRadius"),
      maxHeight: $(el).css("maxHeight"),
      overflowY: "auto",
      padding: $(el).css("padding"),
      position: "relative",
    };
    $el.css({
      overflow: "hidden",
      padding: 0,
    });
    const scrollContent = $el.children();
    $el.html("<div></div>");
    $el.children().css(style).append(scrollContent);
  });
}
