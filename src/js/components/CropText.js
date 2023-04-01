export default class CropText {
  constructor(options) {
    this.$blocks = $(options.selector);
    this.maxHeight = options.maxHeight;

    this.crop();
  }
  crop() {
    this.$blocks.each((i, block) => {
      let $block = $(block);
      let h = $block.height();
      let contentArr = $block.text().split(" ");
      while (h > this.maxHeight) {
        contentArr.pop();
        let content = contentArr.join(" ");
        if (content[content.length - 1] == ".") content += "..";
        else content += "...";

        $block.text(content);
        h = $block.height();
      }
    });
  }
}
