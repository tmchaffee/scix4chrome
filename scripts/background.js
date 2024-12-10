//this script runs in the background and handles passing information
// between the browser page and the plugin.

let msg = null;
chrome.runtime.onMessage.addListener(
  function(message,sender,response) {
    if (message.from === 'title' && message.subject === 'documentInfo') {
            console.log("Received document title:", message.titles);
            msg = message;
            chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
                if (message.from === 'init' && message.subject === 'getTitle') {
                    // Respond with the stored document title
                    sendResponse({ msg });
                    console.log("Sent message:", msg.titles)
                }
            });
        }
      }
);
