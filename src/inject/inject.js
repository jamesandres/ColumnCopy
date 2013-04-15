/*jslint browser: true, nomen: true, plusplus: true, todo: true, white: true, indent: 2 */
(function (window, document, $) {
  'use strict';

  /**
   * The ColumnSelect class-y function.
   *
   * Given a table, ...
   */
  function ColumnSelect() {
    this.settings = {
      columnSeperator: "\t",
      rowSeparator:    "\n"
    };

    if (window.navigator.userAgent.match(/Windows/) !== -1) {
      this.settings.rowSeparator = "\r\n"; // Yuck.
    }

    this.init();
  }

  ColumnSelect.prototype.init = function () {
    this.bindHandlers();
  };

  ColumnSelect.prototype.bindHandlers = function () {
    var that = this;

    $(document).on('click', 'th,td', function (e) { that.handleCellClick(e, this); });
  };

  // TODO: Different key map for $.client.os === 'Windows'?
  ColumnSelect.prototype.handleCellClick = function (e, cell) {
    var $table = $(cell).parents('table:first');

    // Copy entire table on Alt + Click
    if (e.altKey) {
      this.copyTableContainingCell(cell, $table);
    }
    // Copy column on Meta + Click
    else if (e.metaKey) {
      this.buildColspanMap($table);
      this.copyColumnContainingCell(cell, $table);
    }
  };

  ColumnSelect.prototype.copyTableContainingCell = function (cell, $table) {
    if ($table) {
      this.copiedToClipboardAnimation($table);
      this.copyValuesToClipboard(this.getValuesForTable($table));
    }
  };

  ColumnSelect.prototype.copyColumnContainingCell = function (cell, $table) {
    var data = this.getColumnContainingCell(cell, $table);

    if (data && data.column && data.values) {
      this.copiedToClipboardAnimation(data.column);
      this.copyValuesToClipboard(data.values);
    }
  };

  ColumnSelect.prototype.getColumnContainingCell = function (cell, $table) {
    var that    = this,
        $cell   = $(cell),
        // The column span map for this cell
        cellMap = $cell.data('_ColumnSelect') || [],
        column  = [],
        values  = [],
        row;

    // Unknown error, cell not found in row, cell is not inside a row, or similar.
    if (!cellMap || cellMap.length <= 0) {
      return false;
    }

    $('tr', $table).each(function () {
      row = [];

      $('td,th', this).each(function () {
        var $this = $(this),
            map   = $this.data('_ColumnSelect'),
            i;

        for (i = map.length - 1; i >= 0; i--) {
          if (cellMap.indexOf(map[i]) !== -1) {
            row.push($this.html());
            column.push(this);
            break;
          }
        }
      });

      values.push(row.join(that.settings.columnSeperator));
    });

    return { column: $(column), values: values };
  };

  ColumnSelect.prototype.buildColspanMap = function ($table) {
    var column;

    $('tr', $table).each(function () {
      column = 0;

      $('th,td', this).each(function () {
        var $this = $(this),
            cs    = $this.attr('colspan') || 1,
            map   = [],
            i;

        for (i = 0; i < cs; i++) {
          map.push(column);
          column += 1;
        }

        $(this).data('_ColumnSelect', map);
      });
    });
  };

  ColumnSelect.prototype.getValuesForTable = function ($table) {
    var that   = this,
        values = [],
        row;

    $('tr', $table).each(function () {
      row = [];

      $('td,th', this).each(function () {
        row.push($(this).html());
      });

      values.push(row.join(that.settings.columnSeperator));
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
    chrome.extension.sendMessage({ toCopy: values.join(this.settings.rowSeparator) });
  };


  var _ColumnSelect = new ColumnSelect();

}(window, document, jQuery));
