import React from "react";

function humanFileSize(bytes) {
    var thresh = 1000;
    if(bytes < thresh) return bytes + ' B';
    var units = ['kB','MB','GB','TB','PB','EB','ZB','YB'];
    var u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while(bytes >= thresh);
    return bytes.toFixed(1)+' '+units[u];
}

var Torrent = React.createClass({
  render() {
    var data = this.props.data;
    var percent_done = data.completed_bytes / data.size_bytes;
    if (percent_done == 1) {
      percent_done = 'Completed';
    } else {
      percent_done = Math.round(percent_done * 10000);
      percent_done /= 100;
      percent_done += '%';
    }
    return (
      <tr className="torrent">
        <td>
          {data.name}
          <br/>
          <small>{data.message}</small>
        </td>
        <td>{percent_done}</td>
        <td>{Math.round(data.ratio / 10) / 100}</td>
        <td>{humanFileSize(data.up_rate)} / {humanFileSize(data.down_rate)}</td>
      </tr>
    );
  }
});

var TorrentTable = React.createClass({
  loadTorrentsFromServer() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function(data) {
        this.setState({torrents: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState() {
    return {torrents: []};
  },
  componentDidMount() {
    this.loadTorrentsFromServer();
    setInterval(this.loadTorrentsFromServer, this.props.interval);
  },
  render() {
    var torrents = this.state.torrents.map(function(torrent) {
      return (
        <Torrent data={torrent} key={torrent.hash} />
      );
    })
    return (
      <table className="torrentTable striped">
        <tr>
          <th>Name</th>
          <th>Status</th>
          <th>Ratio</th>
          <th>Rate (up/down)</th>
        </tr>
        {torrents}
      </table>
    );
  }
});

var Container = React.createClass({
  addTorrent(e) {
    var url = prompt('Enter url:');
    console.log(url);
    $.post('/call/load_start', { args: [url] }, function(data) {
      console.log(data);
    });
  },
  render() {
    return (
      <div>
        <TorrentTable url="/torrents.json" interval={2000} />
        <div className="fixed-action-btn" style={{bottom: '45px', right: '24px'}}>
          <a className="btn-floating btn-large waves-effect waves-light red" onClick={this.addTorrent}><i className="mdi-content-add"></i></a>
        </div>
      </div>
    );
  }
});

React.render(
  <Container />,
  document.body
);
