import CheckboxSum from "./CheckboxSum";
export default class CheckboxSumTotal extends CheckboxSum {
  constructor(...attr) {
    super(...attr);
    this.$total = $(this.selectorTotal);
  }
  updateTotal() {
    console.log(this.sum + this.defaultPrice ?? 0);
    let sum = (this.sum + this.defaultPrice).toLocaleString();
    this.$total?.html(sum + " " + this.postfix);
  }
  updateAnswer() {
    super.updateAnswer();
    this.updateTotal();
  }
}
