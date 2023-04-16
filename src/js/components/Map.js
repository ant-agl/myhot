export default class Map {
  activeClass = "active";
  animation = 300;
  textOpen = "Скрыть карту";
  textClose = "Смотреть карту";

  constructor(selectorBtn) {
    this.$btn = $(selectorBtn);
    this.$map = $("#" + this.$btn.data("target"));

    this.$btn.on("click", this.toggle.bind(this));
  }
  toggle() {
    if (!this.$map.hasClass(this.activeClass)) {
      this.open();
    } else {
      this.close();
    }
  }
  open() {
    this.$map.addClass(this.activeClass);
    this.changeTextBtn(this.textOpen);
  }
  close() {
    this.$map.removeClass(this.activeClass);
    this.changeTextBtn(this.textClose);
  }
  changeTextBtn(text) {
    this.$btn.text(text);
  }
}
