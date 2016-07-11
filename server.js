// SERVER-SIDE JAVASCRIPT

//require express in our app
var express = require('express');
// generate a new express app and call it 'app'
var app = express();
var db = require("./models");

// serve static files from public folder
app.use(express.static(__dirname + '/public'));

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/************
 * DATABASE *
 ************/

/* hard-coded data */
// var albums = [];
// albums.push({
//               _id: 132,
//               artistName: 'the Old Kanye',
//               name: 'The College Dropout',
//               releaseDate: '2004, February 10',
//               genres: [ 'rap', 'hip hop' ]
//             });
// albums.push({
//               _id: 133,
//               artistName: 'the New Kanye',
//               name: 'The Life of Pablo',
//               releaseDate: '2016, Febraury 14',
//               genres: [ 'hip hop' ]
//             });
// albums.push({
//               _id: 134,
//               artistName: 'the always rude Kanye',
//               name: 'My Beautiful Dark Twisted Fantasy',
//               releaseDate: '2010, November 22',
//               genres: [ 'rap', 'hip hop' ]
//             });
// albums.push({
//               _id: 135,
//               artistName: 'the sweet Kanye',
//               name: '808s & Heartbreak',
//               releaseDate: '2008, November 24',
//               genres: [ 'r&b', 'electropop', 'synthpop' ]
//             });



/**********
 * ROUTES *
 **********/

/*
 * HTML Endpoints
 */

app.get('/', function homepage (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


/*
 * JSON API Endpoints
 */

app.get('/api', function api_index (req, res){
  res.json({
    message: "Welcome to tunely!",
    documentation_url: "https://github.com/tgaff/tunely/api.md",
    base_url: "http://tunely.herokuapp.com",
    endpoints: [
      {method: "GET", path: "/api", description: "Describes available endpoints"}
    ]
  });
});

app.get('/api/albums', function (req, res){
  db.Album.find({}, function (err, albums) {
    res.json(albums);
  });
});


app.post('/api/albums', function (req, res){
  var newAlbum = req.body;
  var genres = newAlbum.genres.split(',');
  newAlbum.genres = genres;

  db.Album.create(newAlbum, function (err, album) {
    if (err){
      res.send("Error: "+err);
    }
    res.json(album);
  });

});

app.post('/api/albums/:album_id/songs', function (req, res) {
  var body = req.body;
  var albumid = req.params.album_id;
  console.log(albumid);
  console.log(req.body);
  console.log(req);


  db.Album.findOne({_id: albumid}, function (err, album) {
    if (err){
      console.log("error");
      res.send("Error: "+err);
    }
    console.log(req.body);
    album.songs.push(body);
    album.save();
    res.json(album);
  });

});


app.get('/api/albums/:id', function (req, res){
  var id = req.params.id;
  db.Album.findOne({_id: id}, function (err, album) {
    res.json(album);
  });
});

app.delete('/api/albums/:id', function (req, res){
  var id = req.params.id;
  db.Album.findOne({_id: id}).remove(function () {
    res.send("Success");
  });
});



/**********
 * SERVER *
 **********/

// listen on port 3000
app.listen(process.env.PORT || 3000, function () {
  console.log('Express server is running on http://localhost:3000/');
});
