Whitelabel HTML Design
======================
## Overview
Building the HTML Design is a good way to explore the raw assets and understand how they are compiled/merged and minified. You will also see how you could customize and extend the CSS and JS.

The HTML Design comes with a Grunt `Gruntfile.js` which defines the build tasks. Bower is used to manage some of the included libraries. Grunt and Bower run on Node.js, so the first steps are to setup Node, Grunt and Bower on your development machine:

## First time setup
1. Install GIT (this is required by Bower)

2. Install [Node.js v4 (LTS)](https://nodejs.org/en/download/)

3. Install [npm v3](https://docs.npmjs.com/how-npm-works/npm3), [Grunt](http://gruntjs.com/) and [Bower](http://bower.io/) globally from the command prompt:

        npm install -g npm@3
        npm install -g grunt-cli
        npm install -g bower

## Building the assets
Now you are ready to compile the HTML design. Copy the contents of `.\html\design\` from the installation media (or extract the contents of `html-design.zip` from the CMS), and open a command prompt in the root of the folder. You should then run the following commands:

    npm install
    bower install
    grunt build

The compiled assets (HTML, CSS, JavaScript and fonts) will now be found in the `.\dist\` folder.

## Running locally
You can also use Grunt to run the site locally, by changing the last command to:

    grunt serve

A web server will be started on <http://localhost:9000> and when you modify any of the source assets, they will be automatically rebuilt and the browser refreshed.

## Modify the design
The design uses [Bootstrap](http://getbootstrap.com/), which in turn uses [Less](http://lesscss.org/) to manage the CSS. This can be customized by for instance adding or changing standard Bootstrap variables in `.\system\assets\less\_variables.less` and then rebuilding with Grunt.

After modification of the design (i.e. changing the contents of the `.\src\` folder), you can run the following command:

    grunt package

This will generate a `html-design-{jjjj-mm-dd}.zip` file in the `.\zip\` folder. You can upload this zip file in the CMS and republish the HTML design.

### Note
Any changes made to the following files, will be ignored by the build process of the CMS:

- `.bowerrc`
- `bower.json`
- `Gruntfile.js`
- `package.json`
- `README.md`

