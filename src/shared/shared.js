function getDefaultOptions () {
  return {
    columnSeperator: "\t",
    rowSeparator:    "\n",

    columnHotkey:    'alt',
    tableHotkey:     'alt+shift',

    hyperlinkMode:   'off'
  };
}

function getOptions () {
  var options = {};

  if (localStorage.options) {
    options = $.extend(getDefaultOptions(), JSON.parse(localStorage.options));
  } else {
    options = getDefaultOptions();
  }

  if (window.navigator.userAgent.match(/Windows/) !== null) {
    options.rowSeparator = "\r\n"; // Yuck.
  }

  if (window.navigator.userAgent.match(/Linux/) !== null) {
    options.columnHotkey = 'ctrl';
    options.tableHotkey = 'ctrl+shift';
  }

  return options;
}
