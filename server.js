import express from 'express';
import bodyParser from 'body-parser';
import Q from 'q';
import rTorrent from './src/rtorrent.js';
var app = express();

// Serve static files
app.use(express.static('build'));

app.use(bodyParser.urlencoded({extended: true}));
// to support URL-encoded bodies

// Run server
var server = app.listen(8000, () => {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Express listening at http://%s:%s', host, port);
});

app.get('/torrents.json', (req, res) => rTorrent.getTorrents().then((torrents) => res.json(torrents.sort((a, b) => {
    if (b.up_rate - a.up_rate == 0 && b.down_rate - a.down_rate == 0) {
      return b.ratio - a.ratio;
    } else {
      return b.up_rate - a.up_rate + b.down_rate - a.down_rate;
    }
  })
)));

app.post('/call/:method', (req, res) => {
  console.log(req.params.method, req.body.args);
  return rTorrent.call_method(req.params.method, req.body.args).then((result) => res.json(result));
});
