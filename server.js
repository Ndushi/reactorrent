var express = require('express');
var app = express();
var Q = require('q');
var rTorrent = require('./src/rtorrent.js');

// Serve static files
app.use(express.static('build'));

// Run server
var server = app.listen(8000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Express listening at http://%s:%s', host, port);
});

app.get('/torrents.json', function(req, res) {
  return rTorrent.getTorrents().then(function(torrents) {
    res.json(torrents);
  });
});
