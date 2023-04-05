import "air-datepicker/air-datepicker.css";
import AirDatepicker from "air-datepicker";
import moment from "moment";

export default class GuestList {
  classRemove = "remove";
  animate = 200;

  constructor(selectorBlock, selectorAdd, selectorRemove, selectorItem) {
    this.$block = $(selectorBlock);
    this.$addBtn = $(selectorAdd);
    this.selectorItem = selectorItem;
    this.selectorRemove = selectorRemove;

    this.$addBtn.on("click", this.add.bind(this));
    $("body").on("click", this.selectorRemove, this.delete.bind(this));
  }
  add() {
    this.$block.append(`
      <div class="booking-form__guest">
        <div class="booking-form__title booking-form__remove-guest">Добавить гостя <img class="booking-form__sign"
            src="../img/icons/minus-line.png"></div>
        <div class="booking-form__row">
          <input type="text" name="surname" placeholder="Фамилия">
          <input type="text" name="name" placeholder="Имя">
          <input type="text" name="patronymic" placeholder="Отчество (при наличии)">
        </div>
        <div class="booking-form__row">
          <input type="text" name="birthday" placeholder="Дата рождения" readonly>
        </div>
      </div>
    `);

    new AirDatepicker('.booking-form__guest:last-child [name="birthday"]', {
      isMobile: $(window).outerWidth() <= 767,
      autoClose: true,
    });
  }
  delete(e) {
    let $el = $(e.target).closest(this.selectorItem);
    $el.addClass(this.classRemove);
    setTimeout(() => {
      $el.remove();
    }, this.animate);
  }
}
