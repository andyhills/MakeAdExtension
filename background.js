var adPage, tab_id;

chrome.tabs.onRemoved.addListener(function (id){
  if (id == tab_id) {
    tab_id = undefined;
  }
});
chrome.tabs.onReplaced.addListener(function (id){
  if (id == tab_id) {
    tab_id = undefined;
  }
});
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.greeting == "hello")
      sendResponse({ad: adPage});
  });
