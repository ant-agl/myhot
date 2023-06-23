import "./components/WidgetChat";
import Chat from "./components/chat";
new Chat(".widget-chat__content .chat");

import "jquery-mask-plugin";
$(".mask-phone").mask("+7 (000) 000-00-00", {
  placeholder: "+7 (___) ___-__-__",
});

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

import "./components/header";

bgVideo();
$(window).resize(bgVideo);
function bgVideo() {
  if ($(window).outerWidth() < 700) {
    $(".block_1_video").remove();
  } else {
    $(".block_1").prepend(`
      <video class="block_1_video" pip="false" autoplay muted loop poster="./img/index/avif/bg.png">
        <source src="./img/index/avif/sea.webm" type="video/webm">
      </video>
    `);
  }
}

$("body").on("click", ".toggle-show-password", function () {
  $(this).find("img").toggleClass("active");
  let $input = $(this).parent().find("input");
  if ($input.attr("type") == "password") $input.attr("type", "text");
  else $input.attr("type", "password");
});
