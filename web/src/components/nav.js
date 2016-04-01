const React = require('react');
const {
  Link,
  IndexLink,
} = require('react-router');
const {
  Navbar,
  Nav,
  NavItem,
} = require('react-bootstrap');

const NavLink = React.createClass({
  render(){
    const className = this.context.router.isActive(this.props.to)?'active':'';
    return <li className={className}><Link {...this.props}/></li>;
  }
});

NavLink.contextTypes = {
  router: React.PropTypes.object.isRequired
};

const IndexNavLink = React.createClass({
  render(){
    return <IndexLink {...this.props} activeClassName="active"/>;
  }
});

module.exports = React.createClass({
  render(){
    return (
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <IndexNavLink to="/">HRRHMR Starter</IndexNavLink>
          </Navbar.Brand>
        </Navbar.Header>
        <Nav>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          <NavLink to="/notfound">404 Not Found</NavLink>
        </Nav>
      </Navbar>
    );
  }
});
