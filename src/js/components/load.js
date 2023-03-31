export function startLoad($el) {
  $el.html(
    '<img src="https://cdn-icons-png.flaticon.com/512/9823/9823161.png" class="load">'
  );
}
export function endLoad($el) {
  $el.find(".load").remove();
}
