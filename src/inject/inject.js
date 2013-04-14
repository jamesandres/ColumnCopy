(function (window, $) {

  /**
   * The ColumnSelect class-y function.
   *
   * Given a table, ...
   */
  function ColumnSelect(table) {
    this.table = table;

    this.init(this.table);
  }

  ColumnSelect.prototype.init = function (table) {
    this.buildColspanMap(table);
    this.bindHandlers(table);
  };

  ColumnSelect.prototype.buildColspanMap = function (table) {
    var column;

    $('tr', table).each(function () {
      column = 0;

      $('th,td', this).each(function () {
        var $this = $(this),
            cs    = $this.attr('colspan') || 1,
            map   = [],
            i;

        for (i = 0; i < cs; i++) {
          map.push(column);
          column += 1;
        };

        $(this).data('_ColumnSelect', map);
      });
    });
  };

  ColumnSelect.prototype.bindHandlers = function (table) {
    var that = this;

    $('th,td', table).click(function (e) { that.handleCellClick(e, this); });
  };

  ColumnSelect.prototype.handleCellClick = function (e, cell) {
    // Copy entire table on Alt + Click
    if (e.altKey) {
      this.copyTable(cell);
    }
    // Copy column on Meta + Click
    else if (e.metaKey) {
      this.copyColumnContainingCell(cell);
    }
  };

  ColumnSelect.prototype.copyTable = function (cell) {
    var $table = $(this.table);

    if ($table) {
      this.copiedToClipboardAnimation($table);
      this.copyValuesToClipboard(this.getValuesForTable($table));
    }
  };

  ColumnSelect.prototype.copyColumnContainingCell = function (cell) {
    var data = this.getColumnContainingCell(cell);

    if (data && data.column && data.values) {
      this.copiedToClipboardAnimation(data.column);
      this.copyValuesToClipboard(data.values);
    }
  };

  ColumnSelect.prototype.getColumnContainingCell = function (cell) {
    var $cell   = $(cell),
        // The column span map for this cell
        cellMap = $cell.data('_ColumnSelect') || [],
        column  = [],
        values  = [],
        row;

    // Unknown error, cell not found in row, cell is not inside a row, or similar.
    if (!cellMap || cellMap.length <= 0) {
      return false;
    }

    $('tr', this.table).each(function () {
      row = [];

      $('td,th', this).each(function () {
        var $this = $(this),
            map   = $this.data('_ColumnSelect');

        for (var i = map.length - 1; i >= 0; i--) {
          if (cellMap.indexOf(map[i]) !== -1) {
            row.push($this.html());
            column.push(this);
            break;
          }
        }
      });

      values.push(row.join("\t"));
    });

    return { column: $(column), values: values };
  };

  ColumnSelect.prototype.getValuesForTable = function ($table) {
    var values = [],
        row;

    $('tr', $table).each(function () {
      row = []

      $('td,th', this).each(function () {
        row.push($(this).html());
      })

      values.push(row.join("\t"));
    });

    return values;
  };

  ColumnSelect.prototype.copiedToClipboardAnimation = function ($column) {
    $column.addClass('animated copiedToClipboard');

    setTimeout(function () {
      $column.removeClass('animated');
      $column.removeClass('copiedToClipboard');
    }, 1000);
  };

  ColumnSelect.prototype.copyValuesToClipboard = function (values) {
    // Ping the background.html page, this is where the clipboard
    // communication happens
    // See: http://stackoverflow.com/a/8807145/806988
    chrome.extension.sendMessage({ toCopy: values.join("\n") });
  };


  // Bind the column select plugin to every table on the page
  $('table').each(function () {
    $(this).data('_ColumnSelect', new ColumnSelect(this));
  });


}(window, jQuery));
