export default class Sorting {
  activeSort = {
    name: "recom",
    sort: "desc",
  };
  constructor(selector, options = {}) {
    this.sorting = $(selector);

    for (let key in options) {
      this[key] = options[key];
    }

    this.sorting.on("click", "[data-sort]", this.changeSort.bind(this));
  }
  changeSort(e) {
    let $item = $(e.target).closest("[data-sort]");
    let sort = "desc";
    if ($item.hasClass("desc")) sort = "asc";
    this.activeSort = {
      name: $item.data("sort"),
      sort,
    };

    this.sorting.find("[data-sort]").removeClass("asc desc");
    $item.addClass(sort);

    this.sortHotels();
  }
  sortHotels() {
    let sortHtml = $(".hotels-list .hotel-card").sort((hotel1, hotel2) => {
      let $hotel1 = $(hotel1);
      let $hotel2 = $(hotel2);
      let hotel1_data = {
        price: parseFloat($hotel1.data("price")),
        rank: parseFloat($hotel1.data("rank")),
        popular: parseFloat($hotel1.data("popular")),
        reviews: parseFloat($hotel1.data("reviews")),
      };
      let hotel2_data = {
        price: parseFloat($hotel2.data("price")),
        rank: parseFloat($hotel2.data("rank")),
        popular: parseFloat($hotel2.data("popular")),
        reviews: parseFloat($hotel2.data("reviews")),
      };

      switch (this.activeSort.name) {
        case "price":
          if (this.activeSort.sort == "desc") {
            if (hotel1_data.price < hotel2_data.price) return 1;
            else if (hotel1_data.price > hotel2_data.price) return -1;
          } else {
            if (hotel1_data.price > hotel2_data.price) return 1;
            else if (hotel1_data.price < hotel2_data.price) return -1;
          }
          return 0;
          break;

        case "recom":
          if (this.activeSort.sort == "desc") {
            if (hotel1_data.rank < hotel2_data.rank) return 1;
            else if (hotel1_data.rank > hotel2_data.rank) return -1;

            if (hotel1_data.popular > hotel2_data.popular) return 1;
            else if (hotel1_data.popular < hotel2_data.popular) return -1;

            if (hotel1_data.reviews < hotel2_data.reviews) return 1;
            else if (hotel1_data.reviews > hotel2_data.reviews) return -1;
          } else {
            if (hotel1_data.rank > hotel2_data.rank) return 1;
            else if (hotel1_data.rank < hotel2_data.rank) return -1;

            if (hotel1_data.popular < hotel2_data.popular) return 1;
            else if (hotel1_data.popular > hotel2_data.popular) return -1;

            if (hotel1_data.reviews > hotel2_data.reviews) return 1;
            else if (hotel1_data.reviews < hotel2_data.reviews) return -1;
          }

          return 0;
          break;

        case "reviews":
          if (this.activeSort.sort == "desc") {
            if (hotel1_data.reviews < hotel2_data.reviews) return 1;
            else if (hotel1_data.reviews > hotel2_data.reviews) return -1;
          } else {
            if (hotel1_data.reviews > hotel2_data.reviews) return 1;
            else if (hotel1_data.reviews < hotel2_data.reviews) return -1;
          }
          return 0;
          break;

        default:
          return 0;
      }
    });
    $(".hotels-list").html(sortHtml);
  }
}
