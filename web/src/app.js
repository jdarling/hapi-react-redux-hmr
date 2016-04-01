require('./styles/main.less');
var React = require('react');
var ReactDOM = require('react-dom');
var App = require('./components/app');

require('./reducers');

ReactDOM.render(
  <App />,
  document.querySelector('.app')
);
