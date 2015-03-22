var xmlrpc = require('xmlrpc');
var Q = require('q');

var client = xmlrpc.createClient({host: '10.0.0.20', port: 80, path: '/RPC2'});

function clientMethodCall(name, args) {
  var methods = ['d.multicall', 'load_start'];

  if (methods.indexOf(name) != -1) {
    return Q.Promise(function(resolve, reject, notify) {
      client.methodCall(name, args, function (error, data) {
        if (error === null) {
          resolve(data);
        } else {
          reject(error);
        }
      });
    });
  } else {
    throw new Error(name + ' is not an allowed method');
  }
}

module.exports = {
  getTorrents: function() {
    return clientMethodCall('d.multicall', ['main',
        'd.get_complete=',
        'd.get_hash=',
        'd.get_name=',
        'd.get_message=',
        'd.get_ratio=',
        'd.get_down_rate=',
        'd.get_up_rate=',
        'd.get_completed_bytes=',
        'd.get_size_bytes='
      ]).then(function(data) {
        return data.map(function(torrent) {
          return {
            complete: torrent[0],
            hash: torrent[1],
            name: torrent[2],
            message: torrent[3],
            ratio: torrent[4],
            down_rate: torrent[5],
            up_rate: torrent[6],
            completed_bytes: torrent[7],
            size_bytes: torrent[8]
          };
        });
      });
  },
  call_method: clientMethodCall
};
