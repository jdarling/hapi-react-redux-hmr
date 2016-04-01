const React = require('react');
const Nav = require('./nav');
const {
  Router,
  Route,
  Link,
  IndexRoute,
  hashHistory,
  browserHistory,
} = require('react-router');

const history = browserHistory;

const Home = require('../pages/home');
const About = require('../pages/about');
const Contact = require('../pages/contact');

const PageNotFound = require('../pages/notfound');

const App = React.createClass({
  render(){
    return (
      <div>
        <Nav />
        <div className="page-container">
          {this.props.children}
        </div>
      </div>
    );
  }
});

module.exports = React.createClass({
  render(){
    return (
      <div>
        <Router history={history}>
          <Route path="/" component={App}>
            <IndexRoute component={Home}/>
            <Route path="/about" component={About} />
            <Route path="/contact" component={Contact} />
            <Route path="*" component={PageNotFound} />
          </Route>
        </Router>
      </div>
    );
  }
});
