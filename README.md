# Whitelabel HTML Design #

## Overview ##
Building the HTML Design is a good way to explore the raw assets and understand how they are compiled/merged and minified. You will also see how you could customize and extend the CSS and JS.

The HTML Design comes with a Grunt `Gruntfile.js` which defines the build tasks. Bower is used to manage some of the included libraries. Grunt and Bower run on Node.js, so the first steps are to setup Node, Grunt and Bower on your development machine:

## First time setup ##
1. Install GIT (this is required by Bower)

2. Install [Node.js](http://nodejs.org/)

3. Install [Grunt](http://gruntjs.com/) and [Bower](http://bower.io/) globally from the command prompt:

        npm install -g grunt-cli
        npm install -g bower

## Building the assets ##
Now you are ready to compile the HTML design. Extract the contents of the `html-design.zip` from the installation media, and open a command prompt in the root of the folder. You should then run the following commands:

    npm install
    bower install
    grunt build

The compiled assets (HTML, CSS, JavaScript and fonts) will now be found in the **dist** folder.

## Running locally ##
You can also use Grunt to run the site locally, by changing the last command to:

    grunt serve

A web server will be started on http://localhost:9000 and when you modify any of the source assets, they will be automatically rebuilt and the browser refreshed.

## Modify design ##
The design uses Bootstrap, which in turn uses LESS to manage the CSS. This can be customized by adding/changing standard bootstrap variables in `/assets/less/_variables.less` and then rebuilding with grunt.

After modification of the design (i.e. changing the contents of the **src** folder), you can add your changes to the `html-design.zip`. Now you can upload this zip file in the CMS and republish the HTML design.

## Note ##
Any changes made to the following files, will be ignored by the build process of the CMS:

- `.bowerrc`
- `bower.json`
- `Gruntfile.js`
- `package.json`
- `README.md`

