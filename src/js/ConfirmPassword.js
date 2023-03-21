export default class ConfirmPassword {
  constructor(selectorInputs, selectorBtn, settings={}) {
    this.$inputs = $(selectorInputs);
    this.$btn = $(selectorBtn);

    for (let key in settings) {
      this[key] = settings[key];
    }

    this.$inputs.on('input keydown click', this.replaceFocus.bind(this));
    this.$btn.on('click', this.sendCode.bind(this));
  }
  replaceFocus(e) {
    this.changeMessage('');

    this.$inputs.each((i, el) => {
      let val = $(el).val().trim();
      if (val.length > 1) {
        for (let j = 0; j < val.length; j++) {
          this.$inputs.eq(i+j).val(val[j]);
        }
      }
    });

    let key = e.key;
    let isFull = true;
    this.$inputs.each((i, el) => {
      if ($(el).val().trim() == '') {
        if ((key == 'Backspace' || key == 'Delete') && i > 0) {
          this.$inputs.eq(i-1).val('').focus();
        } else {
          $(el).focus();
        }
        isFull = false;
        return false;
      }
    });
    if (isFull)
      this.$btn.trigger('click');
  }
  sendCode() {
    let val = '';
    this.$inputs.each((i, el) => {
      val += $(el).val().trim();
    });

    let code = 1122;//test
    if (val == code) {
      this.changeMessage('Успешно!');
      this.afterSendSuccess();
    } else {
      this.clearValue();
      this.focusFirst();
      this.changeMessage('Ошибка!', false);
    }
    return;
    $.ajax();
  }
  changeMessage(text='', success=true) {
    $('.modal__message')
      .text(text)
      .removeClass('modal__message_success modal__message_error')
      .addClass(success ? 'modal__message_success' : 'modal__message_error');
  }
  clearValue() {
    this.$inputs.val('');
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
}