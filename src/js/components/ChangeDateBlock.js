import "air-datepicker/air-datepicker.css";
import AirDatepicker from "air-datepicker";
import moment from "moment";

export default class ChangeDateBlock {
  inputFromName = "date-from";
  inputToName = "date-to";
  classSelected = "selected";
  classNotSelected = "not-selected";
  classActive = "active";
  selectorBtn = "button";
  textSelect = "Изменить";
  textNotSelect = "Сохранить";

  constructor(selector, options) {
    this.$block = $(selector);

    for (let key in options) {
      this[key] = options[key];
    }

    this.$selected = this.$block.find("." + this.classSelected);
    this.$notSelected = this.$block.find("." + this.classNotSelected);
    this.$btn = this.$block.find(this.selectorBtn);

    this.setDatepicker();
    this.viewSelectedDate();

    this.$btn.on("click", this.toggle.bind(this));
  }
  setDatepicker() {
    this.datepickerFrom = new AirDatepicker(`[name="${this.inputFromName}"]`, {
      autoClose: true,
      isMobile: $(window).outerWidth() <= 767,
      selectedDates: new Date(),
      minDate: new Date(),
      onSelect: ({ date }) => {
        let minDate = moment(date).add(1, "days");
        if (this.datepickerTo.selectedDates[0] < minDate) {
          this.datepickerTo.selectDate(minDate);
        }
        this.datepickerTo.update({
          minDate,
        });
      },
    });
    this.datepickerTo = new AirDatepicker(`[name="${this.inputToName}"]`, {
      autoClose: true,
      isMobile: $(window).outerWidth() <= 767,
      minDate: moment().add(1, "days"),
      selectedDates: moment().add(1, "days"),
    });

    $(window).resize(() => {
      let w = $(window).outerWidth();
      let isMobile = w <= 767;
      this.datepickerFrom.update({
        isMobile,
      });
      this.datepickerTo.update({
        isMobile,
      });
    });
  }
  toggle() {
    if (this.isSelect()) {
      this.change();
    } else {
      this.save();
    }
  }
  change() {
    this.$selected.removeClass(this.classActive);
    this.$notSelected.addClass(this.classActive);
    this.changeText(this.textNotSelect);
  }
  save() {
    this.viewSelectedDate();
    this.$selected.addClass(this.classActive);
    this.$notSelected.removeClass(this.classActive);
    this.changeText(this.textSelect);
  }
  viewSelectedDate() {
    let from = this.datepickerFrom.selectedDates[0];
    let fromWeekday = moment(from).format("dddd");
    let fromDate = moment(from).format("D MMMM YYYY");
    this.$block
      .find('[data-type="from-weekday"]')
      .text(this._firstCharUpper(fromWeekday));
    this.$block.find('[data-type="from-date"]').text(fromDate);

    let to = this.datepickerTo.selectedDates[0];
    let toWeekday = moment(to).format("dddd");
    let toDate = moment(to).format("D MMMM YYYY");
    this.$block
      .find('[data-type="to-weekday"]')
      .text(this._firstCharUpper(toWeekday));
    this.$block.find('[data-type="to-date"]').text(toDate);
  }
  changeText(text) {
    this.$btn.text(text);
  }
  isSelect() {
    return this.$selected.hasClass(this.classActive);
  }
  _firstCharUpper(str) {
    return str[0].toUpperCase() + str.slice(1);
  }
}
