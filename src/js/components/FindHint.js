import { data2get } from "./data2get";
// import scrollOverflow from "./scrollOverflow";

export default class FindHint {
  classActive = "active";
  // selectorHint = "+ .find-hint";
  selectorHint = "+ .find-hint";
  classHintItem = "find-hint__item";
  foundElements = {};
  search = "";
  url = "https://bytrip.ru/php/conditional_search.php";

  constructor(selectorInput, options = {}) {
    this.$input = $(selectorInput);

    for (let key in options) {
      this[key] = options[key];
    }

    this.$hint = this.$input.find(this.selectorHint);
    this.$input.on("focus input", this.changeSearch.bind(this));
    this.$input.on("keyup", this.selectKey.bind(this));
    this.$input.on("keyup", this.selectItem.bind(this));
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

    this.$hint.find(".find-hint__overflow").html(html);
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
  selectKey(e) {
    let itemsCount = this.$hint.find(".find-hint__item").length;
    let $itemSelect = this.$hint.find(".find-hint__item.select");
    let indexSelect = $itemSelect?.index();

    switch (e.keyCode) {
      case 38: // top
        $itemSelect.removeClass("select");
        if (indexSelect == -1 || indexSelect == 0)
          this.$hint.find(".find-hint__item").last().addClass("select");
        else $itemSelect.prev().addClass("select");
        break;
      case 40: // bottom
        $itemSelect.removeClass("select");
        if (indexSelect == -1 || indexSelect == itemsCount - 1)
          this.$hint.find(".find-hint__item").first().addClass("select");
        else $itemSelect.next().addClass("select");
        break;
    }

    $itemSelect = this.$hint.find(".find-hint__item.select");
    this.$hint.find("> *").scrollTop($itemSelect[0].offsetTop);
  }
  selectItem(e) {
    e.preventDefault();
    e.stopPropagation();
    switch (e.keyCode) {
      case 13: // enter
        let $itemSelect = this.$hint.find(".find-hint__item.select");
        let text = $itemSelect.text().trim();
        this.$input.val(text).trigger("change").blur();
        return;
    }
  }
}
