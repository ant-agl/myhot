import { DualHRangeBar } from "dual-range-bar";
export default class Range {
  constructor(options) {
    this.id = options.id;
    this.$inputMin = $(`[name="${options.inputMin ?? ""}"]`);
    this.$inputMax = $(`[name="${options.inputMax ?? ""}"]`);
    this.single = options.single ?? false;
    this.options = options;

    this.drbar = new DualHRangeBar(this.id, options);

    this.drbar.addEventListener("update", this.updateInput.bind(this));

    this.$inputMin.on("input change", this.updateDRBarMin.bind(this));
    this.$inputMax.on("input change", this.updateDRBarMax.bind(this));
  }
  updateInput(e) {
    this.$inputMin.val(Math.round(e.detail.lower));
    this.$inputMax.val(Math.round(e.detail.upper));

    if (this.single) this.drbar.lower = 0;

    if (this.timerChange) clearTimeout(this.timerChange);
    this.timerChange = setTimeout(() => {
      this.$inputMax.trigger("change");
    }, 500);
  }
  updateDRBarMin(e) {
    let $el = $(e.target);
    let val = $el.val();

    if (val < this.drbar.lowerBound) val = this.drbar.lowerBound;
    if (val > this.drbar.upper - this.drbar.minSpan)
      val = this.drbar.upper - this.drbar.minSpan;

    this.drbar.lower = val;
    $el.one("blur", () => $el.val(val));
  }
  updateDRBarMax(e) {
    let $el = $(e.target);
    let val = $el.val();

    if (val > this.drbar.upperBound) val = this.drbar.upperBound;
    if (val < this.drbar.lower + this.drbar.minSpan)
      val = this.drbar.lower + this.drbar.minSpan;

    this.drbar.upper = val;
    $el.one("blur", () => $el.val(val));
  }
}
