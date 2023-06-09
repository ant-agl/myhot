export default class InputCount {
  min = 0;
  max = 99;
  constructor() {
    $("body").on("input change", ".input-count__input", this.input.bind(this));
    $("body").on("click", ".input-count__sign_minus", this.minus.bind(this));
    $("body").on("click", ".input-count__sign_plus", this.plus.bind(this));
  }
  input(e) {
    let $input = $(e.target)
      .closest(".input-count")
      .find(".input-count__input");

    let val = this.toNumber($input.val());
    val = this.checkVal($input, val);
    $input.val(val);
  }
  minus(e) {
    let $input = $(e.target)
      .closest(".input-count")
      .find(".input-count__input");

    let val = this.toNumber($input.val()) - 1;
    val = this.checkVal($input, val);
    $input.val(val).trigger("change");
  }
  plus(e) {
    let $input = $(e.target)
      .closest(".input-count")
      .find(".input-count__input");

    let val = this.toNumber($input.val()) + 1;
    val = this.checkVal($input, val);
    $input.val(val).trigger("change");
  }
  checkVal($input, val) {
    let min = parseInt($input.attr("min") ?? this.min);
    let max = parseInt($input.attr("max") ?? this.max);

    if (val < min) val = min;
    if (val > max) val = max;

    return val;
  }
  toNumber(val) {
    return parseInt(val.replace(/\D/g, "")) || 0;
  }
}
