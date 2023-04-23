import Validation from "./Validation";

export default class Modal {
  openClass = "modal_open";
  timeAnimate = 200;
  closeToBackground = true;
  constructor(selectorModal, settings = {}) {
    this.$modal = $(selectorModal);
    this.modalId = $(selectorModal).attr("id");

    for (let key in settings) {
      this[key] = settings[key];
    }

    $("body").on(
      "click",
      `[data-modal-target="${this.modalId}"]`,
      this.open.bind(this)
    );
    $("body").on(
      "click",
      `[data-modal-target-close="${this.modalId}"]`,
      this.close.bind(this)
    );
    this.$modal.on("click", (e) => {
      if (this.closeToBackground && $(e.target).hasClass("modal")) this.close();
    });
    this.$modal.on("click", "[to-page]", this.changePage.bind(this));
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
  validPage(page) {
    let valid = new Validation(`#${this.modalId} [data-page="${page}"]`);
    return valid.validate();
  }
  changePage(e) {
    let $el = $(e.target);
    let thisPage = $el.closest("[data-page]").data("page");
    let page = $el.attr("to-page");

    let valid = true;
    if ($el.attr("page-validate") == "true") {
      valid = this.validPage(thisPage);
    }
    if (!valid) return;

    this.toPage(page);
  }
  toPage(page) {
    this.$modal.find("[data-page]").removeClass("active");
    this.$modal.find(`[data-page="${page}"]`).addClass("active");
  }
}
