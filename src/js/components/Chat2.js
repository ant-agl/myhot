import { active } from "browser-sync";

export default class Chat {
  constructor(selector, options = []) {
    this.chat = $(selector);
    this.input = this.chat.find(".chat__input");
    this.btnSend = this.chat.find(".chat__send");

    this.input.on("input", this.replaceStateBtn.bind(this));

    this.chat.find(".chats__item").on("click", this.openChat.bind(this));
    this.chat.find(".chat__back").on("click", this.closeChat.bind(this));

    setTimeout(() => {
      this.addMobileClass();
    });
    $(window).on("resize", this.addMobileClass.bind(this));
  }
  replaceStateBtn() {
    if (this.input.val().trim().length) {
      this.btnSend.prop("disabled", false);
    } else {
      this.btnSend.prop("disabled", true);
    }
  }
  addMobileClass() {
    if (this.chat.outerWidth() > 640) this.chat.removeClass("chat_mobile");
    else this.chat.addClass("chat_mobile");
  }
  openChat(e) {
    this.chat.addClass("chat_open");
    let $item = $(e.target).closest(".chats__item");
    $(".chats__item").removeClass("active");
    $item.addClass("active");
  }
  closeChat() {
    this.chat.removeClass("chat_open");
  }
}
