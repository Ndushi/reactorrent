import React from "react";

var Torrent = React.createClass({
  render() {
    var data = this.props.data;
    return (
      <tr className="torrent">
        <td>{data.complete}</td>
        <td>{data.name}</td>
        <td>{data.message}</td>
        <td>{data.ratio}</td>
        <td>{data.down_rate}</td>
        <td>{data.up_rate}</td>
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
      <table className="torrentTable">
        {torrents}
      </table>
    );
  }
});

React.render(
  <TorrentTable url="/torrents.json" interval={2000} />,
  document.getElementById('content')
);
