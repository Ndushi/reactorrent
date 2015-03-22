var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var Q = require('q');
var rTorrent = require('./src/rtorrent.js');

// Serve static files
app.use(express.static('build'));

app.use(bodyParser.urlencoded({extended: true}));
// to support URL-encoded bodies

// Run server
var server = app.listen(8000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Express listening at http://%s:%s', host, port);
});

app.get('/torrents.json', function(req, res) {
  return rTorrent.getTorrents().then(function(torrents) {
    res.json(torrents.sort(function(a, b) {
      if (b.up_rate - a.up_rate == 0 && b.down_rate - a.down_rate == 0) {
        return b.ratio - a.ratio;
      } else {
        return b.up_rate - a.up_rate + b.down_rate - a.down_rate;
      }
    }));
  });
});

app.post('/call/:method', function(req, res) {
  console.log(req.params.method, req.body.args);
  return rTorrent.call_method(req.params.method, req.body.args).then(function(result) {
    res.json(result);
  });
});
