$(document).ready(function() {
  chrome.runtime.sendMessage({bookmarks: "all"}, function(bookmarks) {

    title = bookmarks[50]['title'];
    url = bookmarks[50]['url'];

    htmlToInsert = "<div class='bm-res'>" +
                   "<a href='" + url + "'>" + title + "</a>" +
                   "</div>"

    $("#res").before(htmlToInsert);
    ;
  });
});