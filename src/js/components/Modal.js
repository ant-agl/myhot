export default class Modal {
  openClass = "modal_open";
  timeAnimate = 200;
  closeToBackground = true;
  constructor(selectorModal, settings = {}) {
    this.$modal = $(selectorModal);
    this.id = $(selectorModal).attr("id");

    for (let key in settings) {
      this[key] = settings[key];
    }

    $("body").on("click", `[data-target="${this.id}"]`, this.open.bind(this));
    $("body").on(
      "click",
      `[data-target-close="${this.id}"]`,
      this.close.bind(this)
    );
    this.$modal.on("click", (e) => {
      if (this.closeToBackground && $(e.target).hasClass("modal")) this.close();
    });
  }
  open() {
    if (!this.beforeOpen()) return;
    this.$modal.css("display", "flex");
    setTimeout(() => {
      this.$modal.addClass(this.openClass);
    });

    $("body").css("overflow", "hidden");
  }
  close() {
    this.$modal.removeClass(this.openClass);
    setTimeout(() => {
      this.$modal.css("display", "none");
    }, this.timeAnimate);

    $("body").css("overflow", "auto");
  }
  beforeOpen() {
    return true;
  }
}
