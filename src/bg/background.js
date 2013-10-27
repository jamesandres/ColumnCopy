// Bind the context handlers
var contexts = {
      copyColumn: chrome.contextMenus.create({
        'title': 'Copy this column',
        'contexts': ['all'],
        'onclick': handleContextMenuClick
      }),
      copyTable: chrome.contextMenus.create({
        'title': 'Copy entire table',
        'contexts': ['all'],
        'onclick': handleContextMenuClick
      }),
    };

function handleContextMenuClick(info, tab) {
  switch (info.menuItemId) {
    case contexts.copyColumn:
      chrome.tabs.sendMessage(tab.id, { columnCopyContextMenuClick: 'copyColumn' });
      break;
    case contexts.copyTable:
      chrome.tabs.sendMessage(tab.id, { columnCopyContextMenuClick: 'copyTable' });
      break;
  }
}

chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.toCopy) {
    var textarea = document.getElementById("clipboardBridge");
    textarea.value = message.toCopy;
    textarea.focus();
    textarea.select();
    document.execCommand('copy');
  }
  else if (message.gaTrackEvent) {
    _gaq.push(['_trackEvent', message.gaTrackEvent, message.gaTrackEvent]);
  }
});

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
  if (request.method === 'getOptions') {
    sendResponse({ options: getOptions() });
  }
  else {
    sendResponse({});
  }
});

// GA tracking
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-40331704-1']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
