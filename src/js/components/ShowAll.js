import { ResizeSensor } from "css-element-queries";
export default class ShowAll {
  activeCLass = "active";
  textShow = "Скрыть все";
  textHide = "Показать все";
  minShowElements = 3;
  gap = 8;
  animate = 200;

  constructor(id, options = {}) {
    this.$btn = $(`#${id}`);
    this.$block = $(`#${this.$btn.data("target")}`);
    this.setOptions(options);

    this.calculateHeight();

    this.$btn.on("click", this.toggle.bind(this));
    this.$block.find("> *").each((i, el) => {
      new ResizeSensor($(el)[0], () => {
        this.calculateHeight();
      });
    });
  }
  setOptions(options) {
    for (let key in options) {
      this[key] = options[key];
    }
  }
  calculateHeight() {
    let h = 0;
    let fullH = 0;
    this.$block.find("> *").each((i, item) => {
      if (i < this.minShowElements) {
        h += $(item).outerHeight(true) + this.gap;
      }
      fullH += $(item).outerHeight(true) + this.gap;
    });
    h -= this.gap;
    fullH -= this.gap;

    this.maxHeight = h;
    this.fullHeight = fullH;

    if (this.$block.hasClass(this.activeCLass)) {
      this.show();
    } else {
      this.hide();
    }
  }
  setDefaultState() {
    if (this.$block.find("> *").length <= this.minShowElements) {
      this.$btn.hide();
    } else {
      this.hide(false);
    }
  }
  toggle() {
    if (!this.$block.hasClass(this.activeCLass)) {
      this.show();
    } else {
      this.hide();
    }
  }
  hide(isAnimate = true) {
    console.log("hide", this.maxHeight, this.fullHeight);
    if (isAnimate) {
      this.$block
        .removeClass(this.activeCLass)
        .animate({ maxHeight: this.maxHeight }, this.animate);
    } else {
      this.$block
        .removeClass(this.activeCLass)
        .css("maxHeight", this.maxHeight);
    }
    this.$btn.text(this.textHide);
  }
  show(isAnimate = true) {
    console.log("show", this.maxHeight, this.fullHeight);
    if (isAnimate) {
      this.$block
        .addClass(this.activeCLass)
        .animate({ maxHeight: this.fullHeight }, this.animate);
    } else {
      this.$block.addClass(this.activeCLass).css("maxHeight", this.fullHeight);
    }
    this.$btn.text(this.textShow);
  }
}
