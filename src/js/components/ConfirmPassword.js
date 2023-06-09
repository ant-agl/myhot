export default class ConfirmPassword {
  url = "";
  data = {};

  constructor(selectorInputs, selectorBtn, settings = {}) {
    this.$inputs = $(selectorInputs);
    this.$btn = $(selectorBtn);

    for (let key in settings) {
      this[key] = settings[key];
    }

    $("body").on(
      "input keydown click",
      selectorInputs,
      this.replaceFocus.bind(this)
    );
    $("body").on("click", selectorBtn, this.sendCode.bind(this));
  }
  replaceFocus(e) {
    this.changeMessage("");

    this.$inputs.each((i, el) => {
      let val = $(el).val().trim();
      if (val.length > 1) {
        for (let j = 0; j < val.length; j++) {
          this.$inputs.eq(i + j).val(val[j]);
        }
      }
    });

    let key = e.key;
    let isFull = true;
    this.$inputs.each((i, el) => {
      if ($(el).val().trim() == "") {
        if ((key == "Backspace" || key == "Delete") && i > 0) {
          this.$inputs
            .eq(i - 1)
            .val("")
            .focus();
        } else {
          $(el).focus();
        }
        isFull = false;
        return false;
      }
    });
    if (isFull) this.$btn.trigger("click");
  }
  getCode() {
    let code = "";
    this.$inputs.each((i, el) => {
      code += $(el).val().trim();
    });
    return code;
  }
  sendCode() {
    let code = this.getCode();

    if (!this.url) return;
    this.data.code = code;
    console.log(this.data);
    $.ajax({
      type: "POST",
      url: this.url,
      data: this.data,
      headers: {
        "X-Auth": localStorage.token ?? "",
      },
      success: (data) => {
        try {
          data = JSON.parse(data);
          console.log(data);
          this.changeMessage("Успешно!");
          this.afterSendSuccess(data);
        } catch (e) {
          console.error(e.message);
        }
      },
      error: (xhr) => {
        console.log(xhr);
        this.clearValue();
        this.focusFirst();
        this.changeMessage("Ошибка!", false);
        this.afterSendError(xhr);
      },
    });
  }
  changeMessage(text = "", success = true) {
    this.$inputs
      .closest(".modal")
      .find(".modal__message")
      .text(text)
      .removeClass("modal__message_success modal__message_error")
      .addClass(success ? "modal__message_success" : "modal__message_error");
  }
  clearValue() {
    this.$inputs.val("");
  }
  clearAll() {
    this.clearValue();
    this.changeMessage();
  }
  focusFirst() {
    setTimeout(() => {
      this.$inputs.eq(0).focus();
    });
  }
  afterSendSuccess() {}
  afterSendError() {}
}
