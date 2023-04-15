import data2get from "./data2get";

export default class FindHint {
  classActive = "active";
  selectorHint = "+ .find-hint";
  classHintItem = "find-hint__item";
  foundElements = [];
  search = "";
  url = "https://wehotel.ru/php/conditional_search.php";

  constructor(selectorInput, options = {}) {
    this.$input = $(selectorInput);

    for (let key in options) {
      this[key] = options[key];
    }

    this.$hint = this.$input.find(this.selectorHint);
    this.$input.on("input", this.changeSearch.bind(this));
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
  }
  changeSearch() {
    this.search = this.$input.val()?.trim()?.toLowerCase();
    this.request();
  }
  updateHint() {
    this.$hint.removeClass(this.classActive);

    let html = "";
    let firstName = this.foundElements[0]?.name;
    if (firstName?.toLowerCase()?.includes(this.search)) {
      html += `<div class="${this.classHintItem}">${firstName}</div>`;
    }
    let firstCity = this.foundElements[0]?.city;
    if (firstCity?.toLowerCase()?.includes(this.search)) {
      html += `<div class="${this.classHintItem}">${firstCity}</div>`;
    }

    this.foundElements.forEach((el) => {
      html += `<div class="${this.classHintItem}">${el.name}. ${el.city}, ${el.country}</div>`;
    });

    this.$hint.html(html);
    if (html != "") this.$hint.addClass(this.classActive);
  }
  request() {
    let get = data2get({ search: this.search });
    $.get(this.url + get, (data) => {
      data = JSON.parse(data);
      console.log(data);
      this.foundElements = data;
      this.updateHint();
    });
  }
}
