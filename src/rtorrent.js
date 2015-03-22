import xmlrpc from 'xmlrpc';
import Q from 'q';

var client = xmlrpc.createClient({host: '10.0.0.20', port: 80, path: '/RPC2'});

function clientMethodCall(name, args) {
  var methods = ['d.multicall', 'load_start'];

  if (methods.indexOf(name) != -1) {
    return Q.Promise((resolve, reject, notify) => {
      client.methodCall(name, args, (error, data) => {
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
  getTorrents() {
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
      ]).then((data) => {
        return data.map((torrent) => {
          var [complete, hash, name, message, ratio, down_rate, up_rate, completed_bytes, size_bytes] = torrent;
          return { complete, hash, name, message, ratio, down_rate, up_rate, completed_bytes, size_bytes };
        });
      });
  },
  call_method: clientMethodCall
};
