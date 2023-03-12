class Filter {
  filterAll = 'all';
  classActive = 'active';
  display = 'block';
  exceptions = [];
  
  constructor ($blockFilters, $items) {
    this.$blockFilters = $blockFilters;
    this.$items = $items;

    this.$blockFilters.on('click', '[data-filter]', (e) => {
      let $target = $(e.target);
      let filter = $target.data('filter');

      if (filter == this.filterAll) {
        this.showItems(this.$items);
      } else {
        this.hideItems(this.$items);
        this.showItems(this.$items.filter((i, item) => {
          let isException = false;
          this.exceptions.forEach(exception => {
            if ($(item).hasClass(exception)) {
              isException = true;
              return false;
            }
          });

          return $(item).data('filter-item') == filter || isException;
        }));
      }

      this.$blockFilters.find('[data-filter]').removeClass(this.classActive);
      $target.addClass(this.classActive);
    });
  }

  hideItems($items) {
    $items.css('display', 'none');
  }
  showItems($items) {
    $items.css('display', this.display);
  }

  addExceptions(exceptions) {
    if (typeof exceptions == 'string') {
      this.exceptions.push(exceptions);
      return;
    }
    exceptions.forEach(exception => {
      this.exceptions.push(exception);
    });
  }
  removeExceptions(exceptions) {
    exceptions.forEach(exception => {
      const index = this.exceptions.indexOf(exception);
      if (index > -1) {
        this.exceptions.splice(index, 1);
      }
    });
  }
}