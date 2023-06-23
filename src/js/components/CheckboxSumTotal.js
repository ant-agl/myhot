import CheckboxSum from "./CheckboxSum";
export default class CheckboxSumTotal extends CheckboxSum {
  constructor(...attr) {
    super(...attr);
    this.$total = $(this.selectorTotal);
  }
  updateTotal() {
    let sum = (this.sum + this.defaultPrice).toLocaleString();
    this.$total?.html(sum + " " + this.postfix);
  }
  updateAnswer() {
    super.updateAnswer();
    this.updateTotal();
  }
}
