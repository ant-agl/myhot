import "./index/uikit.min";
import "./index/uikit-icons.min";

import "jquery-mask-plugin";
$(".mask-phone").mask("+7 (000) 000-00-00", {
  placeholder: "+7 (___) ___-__-__",
});

import ConfirmPassword from "./components/ConfirmPassword";
let confirmPass1 = new ConfirmPassword(
  ".block_register_01 .phone_code",
  ".block_register_01 .next_button",
  {
    url: "",
  }
);
let confirmPass02 = new ConfirmPassword(
  ".block_register_02 .phone_code",
  ".block_register_02 .next_button",
  {
    url: "",
  }
);
let confirmPass2 = new ConfirmPassword(
  ".block_register_2 .phone_code",
  ".block_register_2 .next_button",
  {
    url: "",
  }
);

import "./components/search";

function reloadChatAnimation(close = true) {
  if (close) {
    $(".chat-preview__message").addClass(
      "chat-preview__message-clear-animation"
    );
  }
  $(".chat-preview__message").removeClass("chat-preview__message-animation");
  setTimeout(() => {
    $(".chat-preview__message").addClass("chat-preview__message-animation");
  }, 200);
}
reloadChatAnimation(false);
setInterval(reloadChatAnimation, 1000 * 8);
