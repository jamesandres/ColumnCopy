function getDefaultOptions () {
  var defaultOptions = {
    columnSeparator: "\t",
    rowSeparator:    "\n",

    columnHotkey:    'alt',
    tableHotkey:     'alt+shift',

    hyperlinkMode:   'off'
  };


  if (window.navigator.userAgent.match(/Windows/) !== null) {
    defaultOptions.rowSeparator = "\r\n"; // Yuck.
  }

  if (window.navigator.userAgent.match(/Linux/) !== null) {
    defaultOptions.columnHotkey = 'ctrl';
    defaultOptions.tableHotkey = 'ctrl+shift';
  }

  return defaultOptions;
}

function getOptions () {
  var options = {};

  if (localStorage.options) {
    options = $.extend(getDefaultOptions(), JSON.parse(localStorage.options));
  } else {
    options = getDefaultOptions();
  }

  return options;
}
