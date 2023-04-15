export default class RemoveRow {
  classRemove = "remove-row";
  animation = 300;
  path = "";
  id = "id";
  isRequest = true;

  constructor(selectorRow, selectorBtn, options = {}) {
    this.selectorRow = selectorRow;
    this.selectorBtn = selectorBtn;
    this.$btns = $(selectorBtn);

    for (let key in options) {
      this[key] = options[key];
    }

    this.$btns.on("click", this.remove.bind(this));
  }
  remove(e) {
    let $el = $(e.target);
    let $row = $el.closest(this.selectorRow);
    $row.addClass(this.classRemove);

    setTimeout(() => {
      $row.remove();
    }, this.animation);

    if (isRequest) this.request($el.data("id"));
  }
  request(id) {
    console.log("delete " + id);
    $.get(this.path + `?${this.id}=${id}`);
  }
}
