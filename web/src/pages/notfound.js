const React = require('react');

module.exports = React.createClass({
  render(){
    return (
      <h1>Page "{this.props.routeParams.splat}" not found!</h1>
    );
  }
});
