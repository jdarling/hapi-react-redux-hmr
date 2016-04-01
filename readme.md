HRRHMR Starter v0.0.3
===

A boilerplate project with Hapi React Redux and Webpack with HMR in development mode.

*NOTE:* - For now, due to the fact that hapi-webpack-plugin doesn't surface the Webpack Dev Plugin I've had to put a patched version in the lib folder.  I will be submitting a PR to have the Dev Plugin surfaced to the hapi-webpack-plugin but until it gets integrated in this is the only way I can find to make this fully work.

Built With:
---

* Hapi http://hapijs.com/
* React https://facebook.github.io/react/
* Redux http://redux.js.org/
* Webpack https://webpack.github.io/
* Hapi-Webpack-Plugin https://github.com/SimonDegraeve/hapi-webpack-plugin
* Less http://lesscss.org/
* Bootstrap http://getbootstrap.com/
* Bootswatch slate theme https://bootswatch.com/slate/

With full support for HMR thanks to Hapi-Webpack-Plugin and Webpack.

Getting started:
---

* Clone the repo
* npm install
* npm run dev
* Load http://localhost:8080/
* Open the ./web/src/pages/home.js file and make some changes, they will appear in your browser without a reload.
