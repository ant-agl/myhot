export default class CheckboxSum {
  postfix = "руб.";
  sum = 0;
  constructor(selectorInputBlock, selectorAnswer, options = {}) {
    this.$inputBlock = $(selectorInputBlock);
    this.$answer = $(selectorAnswer);

    for (let key in options) {
      this[key] = options[key];
    }

    this.$inputBlock.on("change", this.updateAnswer.bind(this));
  }
  getSum() {
    let sum = 0;
    this.$inputBlock.find('[type="checkbox"]:checked').each((i, el) => {
      sum += parseFloat($(el).val());
    });
    this.sum = sum;
    return sum;
  }
  updateAnswer() {
    let sum = this.getSum();
    this.$answer.html(sum.toLocaleString() + " " + this.postfix);
  }
}
