export default class Menu {
  menuActiveClass = 'main__menu-item_active';
  tabActiveClass = 'tab-content_active';
  selectItemSelector = '.main__menu-select';

  constructor(selectorMenu, selectorTabs) {
    this.$menu = $(selectorMenu);
    this.$tabs = $(selectorTabs);
    this.$menu.find('[data-target]').on('click', this.selectMenu.bind(this));
  }
  selectMenu(e) {
    let $el = $(e.target).closest('[data-target]');
    let id = $el.data('target');
    let title = $el.data('title');

    this.removeActiveClass();
    this.addActiveClass(id);
    this.changeTitle(title);
  }
  removeActiveClass() {
    this.$menu.find('[data-target]').removeClass(this.menuActiveClass);
    this.$tabs.find('[id]').removeClass(this.tabActiveClass);
  }
  addActiveClass(id) {
    this.$menu.find(`[data-target="${id}"]`).addClass(this.menuActiveClass);
    this.$tabs.find(`#${id}`).addClass(this.tabActiveClass);

    let title = this.$menu.find(`[data-target="${id}"]`).text();
    this.changeSelectItemTitle(title);
  }
  changeSelectItemTitle(title = '') {
    $(this.selectItemSelector).text(title);
  }
  changeTitle(title = '') {
    $('title').text((title ? title + ' | ' : '') + 'MyHot');
  }
}