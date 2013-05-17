chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
  var textarea = document.getElementById("clipboardBridge");
  textarea.value = message.toCopy;
  textarea.focus();
  textarea.select();
  document.execCommand('copy');
});

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
  // TODO: Fix this duplication of defaultOptions from options.js
  var defaultOptions = { columnHotkey: 'alt', tableHotkey: 'alt+shift' };

  if (request.method == 'getOptions') {
    sendResponse({
      options: localStorage.options ? JSON.parse(localStorage.options) : defaultOptions
    });
  }
  else {
    sendResponse({});
  }
});