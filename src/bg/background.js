chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {

  var textarea = document.getElementById("clipboardBridge");
  textarea.value = message.toCopy;
  textarea.focus();
  textarea.select();
  document.execCommand('copy');

});
