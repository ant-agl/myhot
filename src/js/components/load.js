export function startLoad($el) {
  $el.html('<div class="load"></div>');
}
export function endLoad($el) {
  $el.find(".load").remove();
}
