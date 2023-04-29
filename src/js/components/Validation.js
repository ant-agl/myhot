import moment from "moment";
export default class Validation {
  classErrorText = "error-text";
  classError = "error";
  classSuccess = "success";
  isOutputErrors = true;
  onlyFirstError = true;

  constructor(selectorForm, options = {}) {
    this.$form = $(selectorForm);
    this.$inputs = this.$form.find("input[data-validate]");

    for (let key in options) {
      this[key] = options[key];
    }

    let $this = this;
    this.$inputs.on("input change", function () {
      $this.clearError($(this));
    });
  }
  clearError($input) {
    $input.removeClass(this.classError + " " + this.classSuccess);
    $input
      .parent()
      .find("." + this.classErrorText)
      .remove();
  }
  validate() {
    let isSuccess = true;

    this.$inputs.each((i, input) => {
      let $input = $(input);
      this.clearError($input);

      let val = $input.val().trim();
      let rules = $input
        .data("validate")
        .split(" ")
        .map((rule) => rule.trim());

      let errors = [];
      rules.forEach((rule) => {
        let re = /\((.+)\)/;
        let args = [];
        let m = rule.match(re);
        if (m) {
          args = m[1].split(",").map((arg) => arg.trim());
          rule = rule.slice(0, m.index);
        }

        if (!this[rule]) return;

        let res = this[rule](val, args);
        if (!res.success) {
          errors.push(res.text);
        }
      });

      if (errors.length > 0) {
        errors = errors.reverse();
        isSuccess = false;

        if (this.onlyFirstError) errors = errors.slice(-1);
        if (this.isOutputErrors) this.outputErrors($input, errors);

        $input.removeClass(this.classSuccess);
        $input.addClass(this.classError);
      } else {
        $input.removeClass(this.classError);
        $input.addClass(this.classSuccess);
      }
    });

    return isSuccess;
  }
  outputErrors($input, errors) {
    errors.forEach((error) => {
      $input.after(`
        <p class="${this.classErrorText}">${error}</p>
      `);
    });
  }

  required(val) {
    let res = {
      success: val.length > 0,
      text: this.textRequired ?? "Заполните поле",
    };
    return res;
  }
  mail(val) {
    var regex =
      /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
    let success = regex.test(val);
    let res = {
      success,
      text: this.textMail ?? "Введите корректную почту",
    };
    return res;
  }
  phone(val) {
    val = val.replace(/\D/g, "");
    let success = val.length == 11 && (val[0] == 7 || val[0] == 8);
    let res = {
      success,
      text: this.textPhone ?? "Введите корректный телефон",
    };
    return res;
  }
  date(val) {
    let success = moment(val, "DD.MM.YYYY").isValid();
    let res = {
      success,
      text: this.textDate ?? "Введите корректную дату",
    };
    return res;
  }
  dates(val, args = []) {
    let sep = args[0] ?? " - ";
    let t = val.split(sep);
    let success = this.date(t[0]).success && this.date(t[1]).success;
    let res = {
      success,
      text: this.textDates ?? "Введите корректные даты",
    };
    return res;
  }
  min(val, args) {
    let min = args[0];
    let length = val.length;
    let success = length == 0 || length >= min;
    let res = {
      success,
      text: this.textMin ?? `Длина минимум ${min} символов`,
    };
    return res;
  }
  max(val, args) {
    let max = args[0];
    let length = val.length;
    let success = length == 0 || length <= max;
    let res = {
      success,
      text: this.textMax ?? `Длина максимум ${max} символов`,
    };
    return res;
  }
  phoneOrMail(val) {
    let success = this.phone(val).success || this.mail(val).success;
    let res = {
      success,
      text: this.textPhoneOrMail ?? `Неверный формат логина`,
    };
    return res;
  }
  repeat(val, args) {
    let pass = this.$form.find(`[name="${args[0]}"]`)?.val()?.trim();
    let res = {
      success: val == pass,
      text: this.textRepeat ?? `Поля не совпадают`,
    };
    return res;
  }
  password(val) {
    let regex = /^.*(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#@$%&?"]).*$/;
    let success = regex.test(val);
    let res = {
      success,
      text:
        this.textMail ??
        "Пароль должен включать цифры, оба регистра, спец. знак",
    };
    return res;
  }
}
