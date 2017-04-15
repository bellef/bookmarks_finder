var query = null;
/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });
}

// Returns an array of bookmarks
// By recursively parsing bookmark nodes
// And ignoring folder nodes
// TODO: Concat if parent node (folder) contains query
function flatten(xs) {
  return xs.reduce((acc, x) => {
    // If url is defined and url or title matches the query -> concat
    if (x['url'] !== undefined &&
        (query.test(x['url']) || query.test(x['title'])))
      acc = acc.concat(x);
    if (x.children) {
      acc = acc.concat(flatten(x.children));
      x.children = [];
    }
    return acc;
  }, []);
}

function fetchBookmarks(callback) {
  console.log('Looking for: ' + query + ' in bookmarks');

  chrome.bookmarks.getTree(function(bookmarks) {
    res = flatten(bookmarks);
    console.log(res.length + " results found")
    callback(res);
  })
}

/*
  TODO:
  - Add a listener that handles a bookmark query
  - Return only the subset of data that matches the query
*/

// Triggers when a message is received
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.bookmarks)
      query = new RegExp(request.bookmarks);
      fetchBookmarks(sendResponse);
    return true; // Mandatory (cf. onMessage doc)
});
