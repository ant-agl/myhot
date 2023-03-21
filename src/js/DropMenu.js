export default class DropMenu {
  classActive = 'active';
  event = 'click';
  constructor(selectorMenu) {
    this.$menu = $(selectorMenu);
    this.selectorMenu = selectorMenu;

    this.$menu.on(this.event, this.open.bind(this));
    $('body').on('click', this.clickBackground.bind(this));
  }
  clickBackground(e) {
    if ($(e.target).closest(this.selectorMenu).length == 0)
      this.close();
  }
  open() {
    this.$menu.addClass(this.classActive);
  }
  close() {
    this.$menu.removeClass(this.classActive);
  }
}