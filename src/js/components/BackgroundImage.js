export default class BackgroundImage {
  data = "url";
  position = "center center";
  isRepeat = false;
  paddingBottom = 0;
  size = "contain";
  constructor(selector, options) {
    this.$elements = $(selector);

    for (let key in options) {
      this[key] = options[key];
    }

    this.init();
  }
  init() {
    this.$elements.each((i, el) => {
      let url = $(el).data(this.data);
      $(el).css({
        background: `url(${url}) ${this.position} ${
          this.isRepeat ? "repeat" : "no-repeat"
        }`,
        backgroundSize: this.size,
        paddingBottom: this.paddingBottom,
      });
    });
  }
}
