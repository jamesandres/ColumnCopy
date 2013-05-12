jQuery(function ($) {

  // List of keyboard combos from https://github.com/jeresig/jquery.hotkeys/blob/master/test-static-01.html
  var elements = [
        "esc","tab","space","return","backspace",/*"scroll","capslock","numlock",*/"insert","home","del","end","pageup","pagedown",
        "left","up","right","down",
        "f1","f2","f3","f4","f5","f6","f7","f8","f9","f10","f11","f12",
        "1","2","3","4","5","6","7","8","9","0",
        "a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z",
        "Ctrl+a","Ctrl+b","Ctrl+c","Ctrl+d","Ctrl+e","Ctrl+f","Ctrl+g","Ctrl+h","Ctrl+i","Ctrl+j","Ctrl+k","Ctrl+l","Ctrl+m",
        "Ctrl+n","Ctrl+o","Ctrl+p","Ctrl+q","Ctrl+r","Ctrl+s","Ctrl+t","Ctrl+u","Ctrl+v","Ctrl+w","Ctrl+x","Ctrl+y","Ctrl+z",
        "Shift+a","Shift+b","Shift+c","Shift+d","Shift+e","Shift+f","Shift+g","Shift+h","Shift+i","Shift+j","Shift+k","Shift+l",
        "Shift+m","Shift+n","Shift+o","Shift+p","Shift+q","Shift+r","Shift+s","Shift+t","Shift+u","Shift+v","Shift+w","Shift+x",
        "Shift+y","Shift+z",
        "Alt+a","Alt+b","Alt+c","Alt+d","Alt+e","Alt+f","Alt+g","Alt+h","Alt+i","Alt+j","Alt+k","Alt+l",
        "Alt+m","Alt+n","Alt+o","Alt+p","Alt+q","Alt+r","Alt+s","Alt+t","Alt+u","Alt+v","Alt+w","Alt+x","Alt+y","Alt+z",
        "Ctrl+esc","Ctrl+tab","Ctrl+space","Ctrl+return","Ctrl+backspace",/*"Ctrl+scroll","Ctrl+capslock","Ctrl+numlock",*/
        "Ctrl+insert","Ctrl+home","Ctrl+del","Ctrl+end","Ctrl+pageup","Ctrl+pagedown","Ctrl+left","Ctrl+up","Ctrl+right",
        "Ctrl+down",
        "Ctrl+f1","Ctrl+f2","Ctrl+f3","Ctrl+f4","Ctrl+f5","Ctrl+f6","Ctrl+f7","Ctrl+f8","Ctrl+f9","Ctrl+f10","Ctrl+f11","Ctrl+f12",
        "Shift+esc","Shift+tab","Shift+space","Shift+return","Shift+backspace",/*"Shift+scroll","Shift+capslock","Shift+numlock",*/
        "Shift+insert","Shift+home","Shift+del","Shift+end","Shift+pageup","Shift+pagedown","Shift+left","Shift+up",
        "Shift+right","Shift+down",
        "Shift+f1","Shift+f2","Shift+f3","Shift+f4","Shift+f5","Shift+f6","Shift+f7","Shift+f8","Shift+f9","Shift+f10","Shift+f11","Shift+f12",
        "Alt+esc","Alt+tab","Alt+space","Alt+return","Alt+backspace",/*"Alt+scroll","Alt+capslock","Alt+numlock",*/
        "Alt+insert","Alt+home","Alt+del","Alt+end","Alt+pageup","Alt+pagedown","Alt+left","Alt+up","Alt+right","Alt+down",
        "Alt+f1","Alt+f2","Alt+f3","Alt+f4","Alt+f5","Alt+f6","Alt+f7","Alt+f8","Alt+f9","Alt+f10","Alt+f11","Alt+f12"
      ],
      combo = [],
      i;

  $(document).on('keyup', null, '', function (e) {
    combo = [];
  });

  for (i = elements.length - 1; i >= 0; i--) {
    var handler = (function (hotkey) {
          return function (e) {
            if (e.data.keys && combo.indexOf(hotkey) === -1) {
              combo.push(hotkey);
              $('#debug').html(combo.join('+'));
            }
          };
        }(elements[i]));

    $(document).on('keydown', null, elements[i], handler);
  }

});

// function initOptions() {
//   var bgPage = chrome.extension.getBackgroundPage(), options = localStorage.options ? JSON.parse(localStorage.options) : {};
//   var safeMethodInput = document.getElementById("safeMethodInput"), injectInFrameInput = document.getElementById("injectInFrameInput"), addContextMenuInput = document.getElementById("addContextMenuInput");
//   safeMethodInput.checked = options.safeMethod;
//   injectInFrameInput.checked = options.injectInFrame;
//   addContextMenuInput.checked = options.addContextMenu;
//   safeMethodInput.addEventListener("change", function() {
//     options.safeMethod = safeMethodInput.checked;
//     localStorage.options = JSON.stringify(options);
//   });
//   injectInFrameInput.addEventListener("change", function() {
//     options.injectInFrame = injectInFrameInput.checked;
//     localStorage.options = JSON.stringify(options);
//   });
//   addContextMenuInput.addEventListener("change", function() {
//     options.addContextMenu = addContextMenuInput.checked;
//     localStorage.options = JSON.stringify(options);
//     bgPage.refreshMenuEntry();
//   });
//   document.getElementById("open-editor").addEventListener("click", function() {
//     location.href = "csseditor.html";
//   }, false);
// }

// addEventListener("load", initOptions, false);