// Ask background script to query on bookmarks
function queryBookmarks() {
  var query = $("#lst-ib").val();
  console.log("Querying " + query)

  chrome.runtime.sendMessage({bookmarks: query}, function(bookmarks) {
    var htmlToInsert = "<div id='bm-res'>";

    bookmarks.forEach(function(bookmark) {
      // Title equals url if title is empty
      var title = bookmark['title'].length ? bookmark['title'] : bookmark['url'];
      var url = bookmark['url'];

      htmlToInsert += "<ul class='bm'>" +
                      "<li><a href='" + url + "'>" + title + "</a></li>" +
                      "</ul>"
    });
    htmlToInsert += "</div>";

    if ($('#bm-res').length)
      $('#bm-res').remove();
    $("#res").before(htmlToInsert);
  });
}

// DOM is ready
$(document).ready(function() {
  $("#lst-ib").on(
    "keyup input",
    $.debounce(
      300,
      queryBookmarks
    )
  );
});
