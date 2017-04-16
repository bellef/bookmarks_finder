function buildBookmarkElement(title, url) {
  var html = '';
  html += "<div class='bm-elem'>" +
          "<a href='" + url + "'>" +
            "<span class='bm-title'>" + title + "</span><br>" +
            "<span class='bm-url'>" + url.substring(0, 99) +
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

      htmlToInsert += buildBookmarkElement(title, url);
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
