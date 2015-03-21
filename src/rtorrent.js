var xmlrpc = require('xmlrpc');
var Q = require('q');

var client = xmlrpc.createClient({host: '10.0.0.20', port: 80, path: '/RPC2'});

module.exports = {
  getTorrents: function() {
    return Q.Promise(function(resolve, reject, notify) {
      client.methodCall('d.multicall', ['main', 'd.get_complete=', 'd.get_hash=', 'd.get_name=', 'd.get_message=', 'd.get_ratio=', 'd.get_down_rate=', 'd.get_up_rate='], function(error, data) {
        if (error === null) {
          resolve(data.map(function(torrent) {
            return {
              complete: torrent[0],
              hash: torrent[1],
              name: torrent[2],
              message: torrent[3],
              ratio: torrent[4],
              down_rate: torrent[5],
              up_rate: torrent[6]
            };
          }));
        } else {
          reject(error);
        }
      });
    });
  }
};
