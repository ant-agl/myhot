export default class RemoveRow {
  classRemove = 'remove-row';
  animation = 300;
  path = '';

  constructor(selectorRow, selectorBtn) {
    this.selectorRow = selectorRow;
    this.selectorBtn = selectorBtn;
    this.$btns = $(selectorBtn);

    this.$btns.on('click', this.remove.bind(this));
  }
  remove(e) {
    let $el = $(e.target);
    let $row = $el.closest(this.selectorRow);
    $row.addClass(this.classRemove);

    setTimeout(() => {
      $row.remove();
    }, this.animation);

    this.request();
  }
  request() {
    return;
    $.ajax({
      path: this.path,
      method: 'POST',
      data: {}
    });
  }
}