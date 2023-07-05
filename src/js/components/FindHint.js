import { data2get } from "./data2get";
// import scrollOverflow from "./scrollOverflow";

export default class FindHint {
  classActive = "active";
  selectorHint = "+ .find-hint";
  classHintItem = "find-hint__item";
  foundElements = {};
  search = "";
  url = "https://wehotel.ru/php/conditional_search.php";

  constructor(selectorInput, options = {}) {
    this.$input = $(selectorInput);

    for (let key in options) {
      this[key] = options[key];
    }

    this.$hint = this.$input.find(this.selectorHint);
    this.$input.on("focus input", this.changeSearch.bind(this));
    this.$input.on("blur", () => this.$hint.removeClass(this.classActive));
    this.$hint.on(
      "mousedown",
      `.${this.classHintItem}`,
      this.selectHint.bind(this)
    );
  }
  selectHint(e) {
    let $el = $(e.target).closest(`.${this.classHintItem}`);
    let val = $el.text().trim();
    this.$input.val(val);
    this.$hint.removeClass(this.classActive);
  }
  changeSearch() {
    this.search = this.$input.val()?.trim()?.toLowerCase();
    this.request();
  }
  updateHint() {
    this.$hint.removeClass(this.classActive);

    let html = "";
    this.foundElements.city.forEach((el) => {
      html += `<div class="${this.classHintItem}">${el.name}</div>`;
    });
    this.foundElements.hotel.forEach((el) => {
      // html += `<div class="${this.classHintItem}">${el.name}. ${el.city}, ${el.country}</div>`;
      html += `<div class="${this.classHintItem}">${el.name}. ${el.city}</div>`;
    });

    this.$hint.html(html);
    if (html != "") {
      this.$hint.addClass(this.classActive);
      // scrollOverflow(this.$hint);
    }
  }
  request() {
    let get = data2get({ search: this.search });
    $.get(this.url + get, (data) => {
      data = JSON.parse(data);
      this.foundElements = data;
      this.updateHint();
    });
  }
}
