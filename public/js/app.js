/* CLIENT-SIDE JS
 *
 * You may edit this file as you see fit.  Try to separate different components
 * into functions and objects as needed.
 *
 */


/* hard-coded data! */
var sampleAlbums = [];
// sampleAlbums.push({
//              artistName: 'Ladyhawke',
//              name: 'Ladyhawke',
//              releaseDate: '2008, November 18',
//              genres: [ 'new wave', 'indie rock', 'synth pop' ]
//            });
// sampleAlbums.push({
//              artistName: 'The Knife',
//              name: 'Silent Shout',
//              releaseDate: '2006, February 17',
//              genres: [ 'synth pop', 'electronica', 'experimental' ]
//            });
// sampleAlbums.push({
//              artistName: 'Juno Reactor',
//              name: 'Shango',
//              releaseDate: '2000, October 9',
//              genres: [ 'electronic', 'goa trance', 'tribal house' ]
//            });
// sampleAlbums.push({
//              artistName: 'Philip Wesley',
//              name: 'Dark Night of the Soul',
//              releaseDate: '2008, September 12',
//              genres: [ 'piano' ]
//            });
/* end of hard-coded data */




$(document).ready(function() {
  console.log('app.js loaded!');
  $.get("/api/albums", function(data) {
    data.forEach(function (currentValue) {
      renderAlbum(currentValue);
    });
    console.log(data);
  });

  $("#createform").submit(function (event) {
    event.preventDefault();
    var formdata = $(this).serialize();
    $.post("/api/albums", formdata, function (response) {
      renderAlbum(response);
      console.log(response);
    });
    $(this).trigger("reset");
    console.log(formdata);
  });

  $('#albums').on('click', '.add-song', function(e) {
    var id= $(this).parents('.album').data('album-id'); // "5665ff1678209c64e51b4e7b"
    console.log('album song id',id);
    $('#songModal').data('album-id', id);
    $('#songModal').modal();
  });

  $('#albums').on('click', '.delete-album', function(e) {
    var id= $(this).parents('.album').data('album-id'); // "5665ff1678209c64e51b4e7b"
    console.log('album song id',id);
    $.ajax({
      url: '/api/albums/'+id,
      type: 'DELETE',
      success: function(result) {
          deleteAlbum(id);
      }
    });
  });


  $('#saveSong').click(handleNewSongSubmit);

});



function buildSongsHtml(songs) {
  var songText = "  &ndash; ";
  songs.forEach(function(song) {
     songText = songText + "(" + song.trackNumber + ") " + song.name + " &ndash; ";
  });
  var songsHtml  =
  "                      <li class='list-group-item'>" +
  "                        <h4 class='inline-header'>Songs:</h4>" +
  "                         <span>" + songText + "</span>" +
  "                      </li>";
  return songsHtml;
}





// this function takes a single album and renders it to the page
function renderAlbum(album) {

  var albumHtml =
  "        <!-- one album -->" +
  "        <div class='row album' data-album-id='" + album._id + "'>" +
  "          <div class='col-md-10 col-md-offset-1'>" +
  "            <div class='panel panel-default'>" +
  "              <div class='panel-body'>" +
  "              <!-- begin album internal row -->" +
  "                <div class='row'>" +
  "                  <div class='col-md-3 col-xs-12 thumbnail album-art'>" +
  "                     <img src='" + "http://placehold.it/400x400'" +  " alt='album image'>" +
  "                  </div>" +
  "                  <div class='col-md-9 col-xs-12'>" +
  "                    <ul class='list-group'>" +
  "                      <li class='list-group-item'>" +
  "                        <h4 class='inline-header'>Album Name:</h4>" +
  "                        <span class='album-name'>" + album.name + "</span>" +
  "                      </li>" +
  "                      <li class='list-group-item'>" +
  "                        <h4 class='inline-header'>Artist Name:</h4>" +
  "                        <span class='artist-name'>" + album.artistName + "</span>" +
  "                      </li>" +
  "                      <li class='list-group-item'>" +
  "                        <h4 class='inline-header'>Released date:</h4>" +
  "                        <span class='album-releaseDate'>" + album.releaseDate + "</span>" +
  "                      </li>" +
                        buildSongsHtml(album.songs) +
  "                    </ul>" +
  "                  </div>" +
  "                </div>" +
  "                <!-- end of album internal row -->" +

  "              </div>" + // end of panel-body

  "              <div class='panel-footer'>" +
  "                <button class='btn btn-primary add-song'>Add Song</button>" +
  "                <button class='btn btn-warning delete-album'>Delete Album</button>" +
  "              </div>" +

  "            </div>" +
  "          </div>" +
  "          <!-- end one album -->";

  // render to the page with jQuery
  $("#albums").append(albumHtml);

}

function rerenderAlbum(albumid, albumjson) {
  var oldalbum = $("div").find("[data-album-id='" + albumid + "']");
  oldalbum.remove();
  renderAlbum(albumjson);
}

function deleteAlbum(albumid) {
  var oldalbum = $("div").find("[data-album-id='" + albumid + "']");
  oldalbum.remove();
}

function handleNewSongSubmit(e) {
  e.preventDefault();

  console.log("test");


  var songName = $("#songName").val();
  var trackNumber = parseInt($("#trackNumber").val());
  var albumID = $('#songModal').data().albumId;

  console.log(songName);
  console.log(trackNumber);
  console.log(albumID);

  var json = {"name": songName, "trackNumber": trackNumber};

  var url = "http://localhost:3000/api/albums/" + albumID + "/songs";

  $.post(url, json, function (data) {
    rerenderAlbum(albumID, data);
  });
  $("#songName").val("");
  $("#trackNumber").val("");
  $('#songModal').modal("hide");
  // update the correct album to show the new song
}
