export default class BtnRepeat {
  timer = {
    id: undefined,
    seconds: 0,
  };
  btnText = "Отправить повторно";
  constructor(selector, selectorTrigger, options = {}) {
    this.btn = $(selector);
    this.triggerBtn = $(selectorTrigger);

    for (let key in options) {
      this[key] = options[key];
    }

    // this.triggerBtn.on("click", this.startTimer.bind(this));
    $("body").on("click", selectorTrigger, this.startTimer.bind(this));
  }
  startTimer() {
    console.log("trigger click");
    if (this.timer.id) clearInterval(this.timer.id);
    this.btn.prop("disabled", true);

    this.timer.seconds = 59;
    this.timer.id = setInterval(() => {
      if (this.timer.seconds <= 0) {
        this.btn.text(this.btnText);
        this.btn.prop("disabled", false);
        clearInterval(this.timer.id);
        return;
      }

      let seconds = this.timer.seconds;
      if (seconds < 10) seconds = "0" + seconds;

      let text = `00:${seconds} ${this.btnText}`;
      this.btn.text(text);

      this.timer.seconds -= 1;
    }, 1000);
  }
}
