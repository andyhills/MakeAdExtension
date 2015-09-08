chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
  document.write(response.ad);
});