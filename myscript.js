// Insert str2 into str1 at position
function insertStr(str1, str2, position) {
  return str1.substr(0, position) + str2 + str1.substr(position);
}

// Returns text with spans surrounding
// Text that matches query string
function highlightTextWithQuery(string, strQuery) {
  var regexp = RegExp(strQuery.replace(/\s+/g, '.*'), 'i'); // Case insensitive
  var match = string.match(regexp);
  var spanOpen = "<span class='bm-highlight'>";
  var spanClose = "</span>";
  var html = "";

  if (match) {
    html = insertStr(string, spanOpen, match.index);
    html = insertStr(html, spanClose, match.index + match[0].length + spanOpen.length);
    return html;
  }
  return string;
}

// Builds HTML to render for one bookmark
function buildBookmarkElement(title, url, query) {
  var html = '';
  html += "<div class='bm-elem'>" +
          "<a href='" + url + "'>" +
            "<span class='bm-title'>" + highlightTextWithQuery(title, query) + "</span><br>" +
            "<span class='bm-url'>" + highlightTextWithQuery(url, query).substring(0, 99) +
          "</span></a>" +
          "</div>";
  return html;
}

// Ask background script to query on bookmarks
function queryBookmarks() {
  var query = $("#lst-ib").val();
  console.log("Querying " + query)

  chrome.runtime.sendMessage({bookmarks: query}, function(bookmarks) {
    var htmlToInsert = "<div id='bookmarks'>";

    bookmarks.forEach(function(bookmark) {
      // Title equals url if title is empty
      var title = bookmark['title'].length ? bookmark['title'] : bookmark['url'];
      var url = bookmark['url'];

      htmlToInsert += buildBookmarkElement(title, url, query);
    });
    htmlToInsert += "</div>";

    if ($('#bookmarks').length)
      $('#bookmarks').remove();
    if (bookmarks.length)
      $("#res").before(htmlToInsert);
  });
}

// Waiting for page to be completely loaded
// Because we need to be sure
// That the search bar input is accessible
$(document).ready(function() {
  queryBookmarks(); // First call when page loads

  $("#lst-ib").on(
    "keyup input",
    $.debounce(
      300,
      queryBookmarks
    )
  );
});
