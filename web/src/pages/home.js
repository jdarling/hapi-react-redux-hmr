const React = require('react');

module.exports = React.createClass({
  render(){
    return (
      <div className="container">
        <div className="starter-template">
          <h1>Hapi React Redux HMR</h1>
          <p className="lead">A boilerplate project with Hapi React Redux and Webpack with HMR in development mode.</p>
        </div>
        <div>
          <p>Open the ./web/src/pages/home.js file and make some changes, they will appear here without a reload.</p>
          <h2>Built With:</h2>
          <ul>
            <li>Hapi <a href="http://hapijs.com/" target="_blank">http://hapijs.com/</a></li>
            <li>React <a href="https://facebook.github.io/react/" target="_blank">https://facebook.github.io/react/</a></li>
            <li>Redux <a href="http://redux.js.org/" target="_blank">http://redux.js.org/</a></li>
            <li>Webpack <a href="https://webpack.github.io/" target="_blank">https://webpack.github.io/</a></li>
            <li>Hapi-Webpack-Plugin <a href="https://github.com/SimonDegraeve/hapi-webpack-plugin" target="_blank">https://github.com/SimonDegraeve/hapi-webpack-plugin</a></li>
            <li>Less <a href="http://lesscss.org/" target="_blank">http://lesscss.org/</a></li>
            <li>Bootstrap <a href="http://getbootstrap.com/" target="_blank">http://getbootstrap.com/</a></li>
            <li>Bootswatch slate theme <a href="https://bootswatch.com/slate/" target="_blank">https://bootswatch.com/slate/</a></li>
          </ul>
          <p className="lead">With full support for HMR thanks to Hapi-Webpack-Plugin and Webpack.</p>
        </div>
      </div>
    );
  }
});
