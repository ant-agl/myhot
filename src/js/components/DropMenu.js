export default class DropMenu {
  classActive = "active";
  closeBtnToggle = false;
  selectorsNotClose = [];
  isToggleClick = true;
  constructor(selectorMenu, options = {}) {
    this.$menu = $(selectorMenu);
    this.selectorMenu = selectorMenu;

    for (let key in options) {
      this[key] = options[key];
    }

    this.$menu.on("click", this.toggle.bind(this));
    $("body").on("click", this.clickBackground.bind(this));
  }
  clickBackground(e) {
    let close = this.isNotClose($(e.target));
    if (close && $(e.target).closest(this.selectorMenu).length == 0)
      this.close(e);
  }
  open(e = false) {
    if ($(e.target).closest(this.closeBtnToggle).length > 0) return;
    this.$menu.addClass(this.classActive);
  }
  close() {
    this.$menu.removeClass(this.classActive);
  }
  toggle(e) {
    let close = this.isNotClose($(e.target));
    if (close && this.$menu.hasClass(this.classActive)) this.close();
    else this.open();
  }
  setBtnToggle(selector) {
    this.closeBtnToggle = selector;
    $(selector).on("click", this.toggle.bind(this));
  }
  isNotClose($el) {
    let close = true;
    this.selectorsNotClose.forEach((selector) => {
      if ($el.closest(selector).length != 0) close = false;
    });
    return close;
  }
}
