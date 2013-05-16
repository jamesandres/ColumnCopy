/*jslint browser: true, nomen: true, plusplus: true, todo: true, white: true, indent: 2 */
(function (window, document, $) {
  'use strict';

  /**
   * The ColumnCopy function object.
   */
  function ColumnCopy() {
    // TODO: Load options, I think this needs to be done using chrome.extension.connect() + port.onMessage.addListener(function(msg) { if (msg.oninit) { .. } }.
    // var options = localStorage.options ? JSON.parse(localStorage.options) : {};

    this.settings = {
      columnSeperator: "\t",
      rowSeparator:    "\n",
      columnHotkey:    'alt',
      tableHotkey:     'alt+shift'
    };

    if (window.navigator.userAgent.match(/Windows/) !== -1) {
      this.settings.rowSeparator = "\r\n"; // Yuck.
    }

    this.init();
  }

  ColumnCopy.prototype.init = function () {
    this.bindHandlers();
  };

  ColumnCopy.prototype.bindHandlers = function () {
    var that = this;

    // Reset all hotkeys on key release
    this.hotkeysReset();
    $(document).on('keyup', null, '', function () { that.hotkeysReset(); });

    // Set the column hotkey when its combo is pressed. Same for table hotkey.
    $(document).on('keydown', null, this.settings.columnHotkey, function () { that.activeHotkey.column = true; });
    $(document).on('keydown', null, this.settings.tableHotkey, function () { that.activeHotkey.table = true; });

    // Finally, execute the routine on click
    $(document).on('click', 'th,td', function (e) { that.handleCellClick(e, this); });
  };

  ColumnCopy.prototype.hotkeysReset = function () {
    this.activeHotkey = {
      'column': false,
      'table':  false
    };
  };

  // TODO: Different key map for $.client.os === 'Windows'?
  ColumnCopy.prototype.handleCellClick = function (e, cell) {
    var $table = $(cell).parents('table:first');

    if (this.activeHotkey.table) {
      this.copyTableContainingCell(cell, $table);

      // Need to stop bubbling here to support nested tables. For example,
      // consider the case: table > tr > td > table > tr > td{*ColumnCopy here*}.
      e.stopPropagation();
    } else if (this.activeHotkey.column) {
      this.buildColspanMap($table);
      this.copyColumnContainingCell(cell, $table);

      e.stopPropagation();
    }
  };

  ColumnCopy.prototype.copyTableContainingCell = function (cell, $table) {
    if ($table) {
      this.copiedToClipboardAnimation($table);
      this.copyValuesToClipboard(this.getValuesForTable($table));
    }

    if (typeof _gaq !== 'undefined') {
      _gaq.push(['_trackEvent', 'copyTable']);
    }
  };

  ColumnCopy.prototype.copyColumnContainingCell = function (cell, $table) {
    var data = this.getColumnContainingCell(cell, $table);

    if (data && data.column && data.values) {
      this.copiedToClipboardAnimation(data.column);
      this.copyValuesToClipboard(data.values);
    }

    if (typeof _gaq !== 'undefined') {
      _gaq.push(['_trackEvent', 'copyColumn']);
    }
  };

  ColumnCopy.prototype.getColumnContainingCell = function (cell, $table) {
    var that    = this,
        $cell   = $(cell),
        // The column span map for this cell
        cellMap = $cell.data('_ColumnCopy') || [],
        column  = [],
        values  = [],
        row;

    // Unknown error, cell not found in row, cell is not inside a row, or similar.
    if (!cellMap || cellMap.length <= 0) {
      return false;
    }

    $('>tr, >thead>tr, >tbody>tr', $table).each(function () {
      row = [];

      $('>td, >th', this).each(function () {
        var $this = $(this),
            map   = $this.data('_ColumnCopy'),
            i;

        for (i = map.length - 1; i >= 0; i--) {
          if (cellMap.indexOf(map[i]) !== -1) {
            row.push(that.getCellText($this[0]));
            column.push(this);
            break;
          }
        }
      });

      values.push(row.join(that.settings.columnSeperator));
    });

    return { column: $(column), values: values };
  };

  ColumnCopy.prototype.buildColspanMap = function ($table) {
    var column;

    $('>tr, >thead>tr, >tbody>tr', $table).each(function () {
      column = 0;

      $('>td, >th', this).each(function () {
        var $this = $(this),
            cs    = $this.attr('colspan') || 1,
            map   = [],
            i;

        for (i = 0; i < cs; i++) {
          map.push(column);
          column += 1;
        }

        $(this).data('_ColumnCopy', map);
      });
    });
  };

  ColumnCopy.prototype.getValuesForTable = function ($table) {
    var that   = this,
        values = [],
        row;

    $('>tr, >thead>tr, >tbody>tr', $table).each(function () {
      row = [];

      $('>td, >th', this).each(function () {
        row.push(that.getCellText(this));
      });

      values.push(row.join(that.settings.columnSeperator));
    });

    return values;
  };

  /**
   * An similar function to jQuery.text(). This recursively digs through
   * children of a DOM node and retrieves all text nodes and values of relevant
   * form elements.
   *
   * Original concept by James Padolsey.
   * See: http://james.padolsey.com/javascript/replacing-text-in-the-dom-its-not-that-simple/
   */
  ColumnCopy.prototype.getCellText = function (cell) {
    var next, result = [];

    if (cell.nodeType === 1) { // Element node
      if (cell.nodeName === 'INPUT') {
        switch (cell.type) {
          case 'button':
          case 'checkbox':
          case 'file':
          case 'hidden':
          case 'image':
          case 'password':
          case 'radio':
          case 'range':
          case 'reset':
          case 'search':
          case 'submit':
            // Skip these input types, note that TEXTAREA contents are a text node
            // and will be captured by the recursion.
            break;
          default:
            result.push(cell.value);
            break;
        }
      }

      if (cell = cell.firstChild) {
        do {
          next = cell.nextSibling;
          result.push(this.getCellText(cell));
        } while(cell = next);
      }
    } else if (cell.nodeType === 3) { // Text node
      return cell.data;
    }

    return result.join('');
  };

  ColumnCopy.prototype.copiedToClipboardAnimation = function ($column) {
    $column.addClass('animated copiedToClipboard');

    setTimeout(function () {
      $column.removeClass('animated');
      $column.removeClass('copiedToClipboard');
    }, 1000);
  };

  ColumnCopy.prototype.copyValuesToClipboard = function (values) {
    // Ping the background.html page, this is where the clipboard
    // communication happens
    // See: http://stackoverflow.com/a/8807145/806988
    chrome.extension.sendMessage({ toCopy: values.join(this.settings.rowSeparator) });
  };


  var _ColumnCopy = new ColumnCopy();

}(window, document, jQuery));


// GA tracking
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-40331704-1']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
