function getDefaultOptions () {
  var defaultOptions = {
    columnSeparator: "tab", // seperatro name looked up with lookupSeparator (below)
    columnSeparatorVal: "\t",
    rowSeparator:    "\n",
    cellWrapper:     '"',

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

//function to provide the appropriate seperator based on seperator name
function lookupSeparator(sep){
  const seps = { "tab" : "\t", "comma"  : ",", "pipe" : "|",
                "colon" : ":", "semicolon" : ";", "other" : " "};
  return (seps[sep]);
}
