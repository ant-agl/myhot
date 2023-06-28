import moment from "moment";

export default class Chat {
  intervalAll = false;
  intervalChat = false;
  user = {};

  constructor(selector, options = []) {
    this.$chat = $(selector);
    this.input = this.$chat.find(".chat__input");
    this.btnSend = this.$chat.find(".chat__send");

    this.onInit();
  }
  onInit() {
    let $this = this;
    this.intervalAll = setTimeout(function getAllChatInterval() {
      $this.getAllSup();
      $this.getAllInfo();
      $this.getAllHotel();
      $this.intervalAll = setTimeout(getAllChatInterval, 3000);
    }, 0);

    this.input.on("input", this.replaceStateBtn.bind(this));
    this.$chat.on("click", ".chat__send", this.onSendMessage.bind(this));
    this.$chat.on("change", '[name="chat-file"]', this.onSendFile.bind(this));

    this.$chat.on("click", ".chat__text img", this.openImage.bind(this));

    this.$chat.on("click", ".chats__item", this.openChat.bind(this));
    this.$chat.on("click", ".chat__back", this.closeChat.bind(this));

    let intervalIsMobile = setInterval(() => {
      if ($("body").css("display") == "none") return;
      this.addMobileClass();
      clearInterval(intervalIsMobile);
    }, 10);
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
    if (this.$chat.outerWidth() > 640) this.$chat.removeClass("chat_mobile");
    else this.$chat.addClass("chat_mobile");
  }
  openChat(e) {
    this.$chat.addClass("chat_open");
    this.$chat.find(".chat__messages").html("");

    let $item = $(e.target).closest(".chats__item");
    this.$chat.find(".chats__item").removeClass("active");
    $item.addClass("active");
    $item.find(".chats__count").remove();

    let chatId = $item.data("id");
    if (this.intervalChat) clearTimeout(this.intervalChat);

    let $this = this;

    this.intervalChat = setTimeout(function getChatInterval() {
      if ($item.hasClass("hotel-chat")) $this.getChatHotel(chatId);
      else if ($item.hasClass("info-chat")) $this.getChatInfo(chatId);
      else if ($item.hasClass("support-chat")) $this.getChatSup(chatId);

      $this.intervalChat = setTimeout(getChatInterval, 3000);
    }, 0);
  }
  closeChat() {
    this.$chat.removeClass("chat_open");
    this.$chat.find(".chats__item").removeClass("active");
  }
  getAllHotel() {
    if (!localStorage.token) return;
    $.ajax({
      type: "GET",
      url: "https://wehotel.ru/php/chat/chat_all.php",
      headers: {
        "X-Auth": localStorage.token ?? "",
      },
      success: (data) => {
        if (!data) return;
        let items = JSON.parse(data);
        items.forEach((item) => {
          item.class = "hotel-chat";
          this.insertChatHotel(item);
        });
      },
    });
  }
  getChatHotel(id) {
    this.$chat.find(".chat__input-row").show();
    this.$chat.find(".chat__content").data("id", id);

    let $chat = this.$chat.find(`.chats__item.hotel-chat[data-id="${id}"]`);
    let name = $chat.find(".chats__name").text().trim();
    this.$chat.find(".chat__title-value").text(name);

    return $.ajax({
      type: "GET",
      url: "https://wehotel.ru/php/chat/get_chat.php?id_chat=" + id,
      headers: {
        "X-Auth": localStorage.token ?? "",
      },
      success: (data) => {
        data = JSON.parse(data);
        console.log(data);
        data.messages.forEach((message) => {
          let isUser = message.sub_host == "users";
          let img, name;
          if (data.user) {
            this.user = data.user;
          }
          if (isUser) {
            img = data?.user?.img || "/img/no-photo.jpg";
            name = data?.user?.name || "";
          } else {
            img = data?.hotel?.image || "/img/no-photo.jpg";
            name = data?.hotel?.name || "";
          }
          let arrImage = [];
          if (message.image) arrImage.push(message.image);
          this.addMessage(
            message.id,
            message.text,
            arrImage,
            img,
            name,
            isUser
          );
        });
      },
    });
  }
  getAllInfo() {
    if (!localStorage.token) return;
    $.ajax({
      type: "GET",
      url: "https://wehotel.ru/php/chat/get_all_info_chat.php",
      headers: {
        "X-Auth": localStorage.token ?? "",
      },
      success: (data) => {
        if (!data) return;
        let items = JSON.parse(data);
        items.forEach((item) => {
          item.class = "info-chat";
          this.insertChatInfo(item);
        });
      },
    });
  }
  getChatInfo(id) {
    this.$chat.find(".chat__input-row").hide();
    this.$chat.find(".chat__content").data("id", id);

    let $chat = this.$chat.find(`.chats__item.info-chat[data-id="${id}"]`);
    let name = $chat.find(".chats__name").text().trim();
    this.$chat.find(".chat__title-value").text(name);

    return $.ajax({
      type: "GET",
      url: "https://wehotel.ru/php/chat/get_info_chat.php?id_chat=" + id,
      headers: {
        "X-Auth": localStorage.token ?? "",
      },
      success: (data) => {
        data = JSON.parse(data);
        console.log(data);
        data.messages.forEach((message) => {
          this.addMessage(
            message.id,
            message.text,
            message.file,
            "/img/chat/info.jpg",
            "Новости",
            false
          );
        });
      },
    });
  }
  getAllSup() {
    // let $item = this.$chat.find(`.chats__item.support-chat`);

    // let idChat = false;
    // if ($item.length > 0) idChat = $item.data("id");

    // let url = "https://wehotel.ru/php/chat/get_all_supp_chat.php";
    // if (idChat !== false) url += "?id_chat=" + idChat;
    $.ajax({
      type: "GET",
      url: "https://wehotel.ru/php/chat/get_all_supp_chat.php",
      headers: {
        "X-Auth": localStorage.token ?? "",
      },
      success: (data) => {
        if (!data) return;
        let item = JSON.parse(data);
        item.class = "support-chat";
        this.insertChatSup(item);
      },
    });
  }
  getChatSup(id) {
    this.$chat.find(".chat__input-row").show();
    this.$chat.find(".chat__content").data("id", id);

    let $chat = this.$chat.find(`.chats__item.support-chat[data-id="${id}"]`);
    let name = $chat.find(".chats__name").text().trim();
    this.$chat.find(".chat__title-value").text(name);

    return $.ajax({
      type: "GET",
      url: "https://wehotel.ru/php/chat/get_supp_chat.php?id_chat=" + id,
      headers: {
        "X-Auth": localStorage.token ?? "",
      },
      success: (data) => {
        data = JSON.parse(data);
        console.log(data);
        data.messages?.forEach((message) => {
          let isUser = message.host?.host == "users";
          let img, name;
          if (data.user) {
            this.user = data.user;
          }
          if (isUser) {
            img = data?.user?.img || "/img/no-photo.jpg";
            name = data?.user?.name || "";
          } else {
            img = "/img/chat/support.jpg";
            name = "";
          }

          this.addMessage(
            message.id,
            message.text,
            message.file,
            img,
            name,
            isUser
          );
        });
      },
    });
  }
  insertChatHotel(item) {
    let hotel = item.joined_hotel_search[0];
    let countMessage = Number(item.message?.number_of_unread || 0);
    if (item.last_host_user) countMessage = 0;

    let $chatItem = this.$chat.find(
      `.chats__item.${item.class}[data-id="${item.id}"]`
    );
    if ($chatItem.length) {
      $chatItem
        .find(".chats__date")
        .text(moment(item.time * 1000).format("DD.MM.YY"));
      $chatItem.find(".chats__message").text(item.message?.last_message || "");

      $chatItem.find(".chats__count").remove();
      if (countMessage > 0) {
        $chatItem
          .find(".chats__info")
          .last()
          .append(`<div class="chats__count">${countMessage}</div>`);
      }
      return;
    }

    let html = `
      <div class="chats__item ${item.class}" data-id="${
      item.id
    }" data-hotel-id="${item.id_hotel}">
        <div class="chats__img">
          <img src="${hotel.image}">
        </div>
        <div class="chats__content">
          <div class="chats__info">
            <div class="chats__name">${hotel.name}</div>
            <div class="chats__date">${moment(item.time * 1000).format(
              "DD.MM.YY"
            )}</div>
          </div>
          <div class="chats__info">
            <div class="chats__message">${
              item.message?.last_message || ""
            }</div>
            ${
              countMessage > 0
                ? `<div class="chats__count">${countMessage}</div>`
                : ""
            }
          </div>
        </div>
      </div>
    `;
    this.$chat.find(".chats").append(html);
  }
  insertChatInfo(item) {
    let countMessage = Number(item.message?.number_of_unread || 0);

    let $chatItem = this.$chat.find(
      `.chats__item.${item.class}[data-id="${item.id}"]`
    );
    if ($chatItem.length) {
      $chatItem
        .find(".chats__date")
        .text(moment(item.time * 1000).format("DD.MM.YY"));
      $chatItem.find(".chats__message").text(item.message?.last_message || "");

      $chatItem.find(".chats__count").remove();
      if (countMessage > 0) {
        $chatItem
          .find(".chats__info")
          .last()
          .append(`<div class="chats__count">${countMessage}</div>`);
      }
      return;
    }

    let html = `
      <div class="chats__item ${item.class}" data-id="${item.id}">
        <div class="chats__img">
          <img src="/img/chat/info.jpg">
        </div>
        <div class="chats__content">
          <div class="chats__info">
            <div class="chats__name">Новости</div>
            <div class="chats__date">${moment(item.time * 1000).format(
              "DD.MM.YY"
            )}</div>
          </div>
          <div class="chats__info">
            <div class="chats__message">${
              item.message?.last_message || ""
            }</div>
            ${
              countMessage > 0
                ? `<div class="chats__count">${countMessage}</div>`
                : ""
            }
          </div>
        </div>
      </div>
    `;
    this.$chat.find(".chats__fix").append(html);
  }
  insertChatSup(item) {
    let countMessage = Number(item.message?.number_of_unread || 0);
    if (!item.last_host_staff) countMessage = 0;

    let $chatItem = this.$chat.find(
      `.chats__item.${item.class}[data-id="${item.id}"]`
    );
    if ($chatItem.length) {
      $chatItem
        .find(".chats__date")
        .text(moment(item.time * 1000).format("DD.MM.YY"));
      $chatItem.find(".chats__message").text(item.message?.last_message || "");

      $chatItem.find(".chats__count").remove();
      if (countMessage > 0) {
        $chatItem
          .find(".chats__info")
          .last()
          .append(`<div class="chats__count">${countMessage}</div>`);
      }
      return;
    }

    let html = `
      <div class="chats__item ${item.class}" data-id="${item.id}">
        <div class="chats__img">
          <img src="/img/chat/support.jpg">
        </div>
        <div class="chats__content">
          <div class="chats__info">
            <div class="chats__name">Тех. поддержка</div>
            <div class="chats__date">${moment(item.time * 1000).format(
              "DD.MM.YY"
            )}</div>
          </div>
          <div class="chats__info">
            <div class="chats__message">${
              item.message?.last_message || ""
            }</div>
            ${
              countMessage > 0
                ? `<div class="chats__count">${countMessage}</div>`
                : ""
            }
          </div>
        </div>
      </div>
    `;
    this.$chat.find(".chats__fix").prepend(html);
  }
  onSendMessage() {
    console.log("send");
    let $inputText = this.$chat.find(".chat__input");
    let text = $inputText.val()?.trim();
    let id = this.$chat.find(".chat__content").data("id");
    if (!id || !text) return;
    this.sendMessage(id, text);
    $inputText.val("");
  }
  onSendFile() {
    console.log("send file");
    let file = this.$chat.find('[name="chat-file"]')[0].files[0];
    let id = this.$chat.find(".chat__content").data("id");
    if (!id || !file) return;
    this.sendMessage(id, "", file);
  }
  sendMessage(id, text, file = undefined) {
    let formData = new FormData();
    formData.append("id_chat", id);
    if (!text && !file) return;

    if (!text) text = "";

    formData.append("text", text);
    if (file) formData.append("file", file);

    let url = "https://wehotel.ru/php/chat/send_message.php";
    if (this.$chat.find(".support-chat.active").length > 0)
      url = "https://wehotel.ru/php/chat/send_supp_message.php";

    $.ajax({
      type: "POST",
      url,
      headers: {
        "X-Auth": localStorage.token ?? "",
      },
      data: formData,
      contentType: false,
      processData: false,
      success: (id) => {
        console.log(id);
        let img = this.user.img || "../img/no-photo.jpg";
        let name = this.user.name || "";
        if (file) {
          let fileImg = [];
          var fileReader = new FileReader();
          fileReader.readAsDataURL(file);
          fileReader.onload = () => {
            fileImg.push(fileReader.result);
            this.addMessage(id, text, fileImg, img, name, true);
          };
        } else {
          this.addMessage(id, text, [], img, name, true);
        }
      },
    });
  }
  addMessage(id, text, images, avatar, name, isUser) {
    if (
      id === undefined ||
      id === "undefined" ||
      this.$chat.find(`.chat__message[data-id="${id}"]`).length
    )
      return;

    if (text === undefined) text = "";

    let imgHtml = "";
    if (images?.length > 0) {
      images.forEach((img) => {
        imgHtml += `<img src="${img}">`;
      });
    }

    let messagePosition = isUser ? "chat__message_left" : "";
    this.$chat.find(".chat__messages").append(`
      <div class="chat__message ${messagePosition}" data-id="${id}">
        <div class="chat__avatar">
          <div class="chat__img">
            <img src="${avatar}">
          </div>
          <div class="chat__name">${name}</div>
        </div>
        <div class="chat__text"><span>${text}</span>${imgHtml}</div>
      </div>
    `);
    this.scrollDown();
  }
  scrollDown() {
    let time = 0;
    let $this = this;
    setTimeout(function scroll() {
      if ($("body").css("display") != "none") {
        let scrollTop = $this.$chat.find(".chat__messages")[0].scrollHeight;
        $this.$chat.find(".chat__messages").scrollTop(scrollTop);
      } else if (time <= 2000) {
        setTimeout(scroll, 100);
        time += 100;
      }
    });
  }
  openImage(e) {
    this.closeImage();

    let $img = $(e.target).closest("img");

    let params = $img[0].getBoundingClientRect();

    $("body").append(`<div class="open-img-chat"></div>`);
    $(".open-img-chat").addClass("active");
    $img
      .clone()
      .appendTo(".open-img-chat")
      .css({
        transition: "0.3s",
        top: params.top,
        left: params.left,
        width: params.width + "px",
        height: params.height + "px",
        position: "fixed",
        zIndex: "99999",
        margin: "0 auto",
      });

    let $img2 = $(".open-img-chat img");
    let w = $(window).outerWidth();
    let h = $(window).outerHeight();

    let hImg, wImg;

    let rel = params.width / params.height;
    if (w / h > rel) {
      hImg = h;
      wImg = (h / params.height) * params.width;
    } else {
      wImg = w;
      hImg = (w / params.width) * params.height;
    }

    setTimeout(() => {
      $img2.css({
        width: wImg + "px",
        height: hImg + "px",
        top: 0,
        left: 0,
        right: 0,
      });
    });

    $(".open-img-chat").one("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.closeImage();
    });
  }
  closeImage() {
    let $item = $(".open-img-chat");
    $item.removeClass("active");
    setTimeout(() => {
      $item.remove();
    }, 300);
  }
}
