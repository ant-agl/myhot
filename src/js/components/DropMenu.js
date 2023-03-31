export default class DropMenu {
  classActive = 'active';
  closeBtnToggle = false;
  constructor(selectorMenu) {
    this.$menu = $(selectorMenu);
    this.selectorMenu = selectorMenu;

    this.$menu.on('click', this.open.bind(this));
    $('body').on('click', this.clickBackground.bind(this));
  }
  clickBackground(e) {
    if ($(e.target).closest(this.selectorMenu).length == 0)
      this.close(e);
  }
  open(e=false) {
    if ($(e.target).closest(this.closeBtnToggle).length > 0) return;
    this.$menu.addClass(this.classActive);
  }
  close() {
    this.$menu.removeClass(this.classActive);
  }
  toggle() {
    if (this.$menu.hasClass(this.classActive))
      this.close();
    else 
      this.open();
  }
  setBtnToggle(selector) {
    this.closeBtnToggle = selector;
    $(selector).on('click', this.toggle.bind(this));
  }
}