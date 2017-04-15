function bookmarksCss() {
  return "style='" +
          "max-height: 300px;" +
          "overflow: auto;" +
          "'";
}
function bookmarkCss() {
  return "style='" +
          "background-color: #4285f4;" +
          "border-radius: 2px;" +
          "margin-bottom: 10px;" +
          "padding: 5px;" +
          "'";
}

function titleCss() {
  return "style='" +
        "font-size: 17px;" +
        "font-weight: bold;" +
        "color: #fff;" +
        "'";
}

function linkCss() {
  return "style='" +
        "font-size: 10px;" +
        "color: rgba(255, 255, 255, 0.7);" +
        "'";
}

function buildBookmarkElement(title, url) {
  var html = '';
  html += "<div " + bookmarkCss() + ">" +
          "<a href='" + url + "' style='text-decoration: none;'>" +
            "<span " + titleCss() + ">" + title + "</span><br>" +
            "<span " + linkCss() + ">" + url.substring(0, 99) +
          "</span></a>" +
          "</div>";
  return html;
}


// Ask background script to query on bookmarks
function queryBookmarks() {
  var query = $("#lst-ib").val();
  console.log("Querying " + query)

  chrome.runtime.sendMessage({bookmarks: query}, function(bookmarks) {
    var htmlToInsert = "<div id='bookmarks' " + bookmarksCss() + ">";

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

// function buildBookmarkElement(title, url) {
//   var html = '';
//   html += "<ul class='bookmark'>" +
//           "<li><a href='" + url + "'>" + title + "</a></li>" +
//           "</ul>";
//   return html;
// }


// $( document ).ready(function() {
//     console.log( "document loaded" );
// });

// $( window ).on( "load", function() {
//     console.log( "window loaded" );
// });