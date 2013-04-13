(function (window, $) {

  /**
   * The ColumnSelect class-y function.
   *
   * Given a table, ...
   */
  function ColumnSelect(table) {
    this.table = table;

    this.init(this.$table);
  }

  ColumnSelect.prototype.init = function (table) {
    var that = this;

    $('th,td', table).click(function (e) { that.handleCellClick(e, this); });
  };

  ColumnSelect.prototype.handleCellClick = function (e, cell) {
    // Only select the column on Alt + Click
    if (!e.altKey) {
      return;
    }

    var $column = this.getColumnContainingCell(cell);

    if ($column) {
      this.selectColumnAnimation($column);
      this.copyColumnToClipboard($column);
    }
  };

  ColumnSelect.prototype.getColumnContainingCell = function (cell) {
    // Find the column number this cell belongs to, ie: 3rd cell is 3rd column.
    var n = $(cell).index();

    // Unknown error, cell not found in row, cell is not inside a row, or similar.
    if (n < 0) {
      return false;
    }

    // Get all Nth column cells in the table
    return $('th:nth-child(' + (n + 1) + '),td:nth-child(' + (n + 1) + ')', this.table);
  };

  ColumnSelect.prototype.selectColumnAnimation = function ($column) {
    $column.addClass('animated copiedToClipboard');

    setTimeout(function () {
      $column.removeClass('animated');
      $column.removeClass('copiedToClipboard');
    }, 1000);
  }

  ColumnSelect.prototype.copyColumnToClipboard = function ($column) {
    var toCopy = [];

    $column.each(function () {
      toCopy.push($(this).html());
    });

    // Ping the background.html page, this is where the clipboard
    // communication happens
    // See: http://stackoverflow.com/a/8807145/806988
    chrome.extension.sendMessage({ toCopy: toCopy.join("\n") });
  }


  // Bind the column select plugin to every table on the page
  $('table').each(function () {
    $(this).data('_ColumnSelect', new ColumnSelect(this));
  });


}(window, jQuery));
