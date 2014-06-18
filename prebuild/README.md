# SDL Template CMS

These configuration files are used to build the TSI HTML design.

## Files

* `.bowerrc` - to indicate the bower_components need to go in the src directory
* `bower.json` - bower install configuration with dependencies like bootstrap and jquery
* `Gruntfile.js` - grunt build configration
* `package.json` - npm install configuration with grunt modules
* `README.md` - this file

The TSI HTML design uses Bootstrap, which uses LESS to manage the CSS. This can be customized by adding/changing standard bootstrap variables in /assets/less/_variables.less and then rebuilding with grunt.
To compile the HTML design, you need to have node.js installed and also the node package manager, bower and grunt.

1. Install GIT  and make sure that <install-path>/bin is in your PATH variable
2. Clone the html-design repository: http://yourusername@stash.global.sdl.corp:7990/scm/tsi/html-design.git
3. Install node.js and open a command prompt
4. Navigate to the root of the html-design repo in the command prompt
5. (First time only), install grunt and bower globally:
    1. npm install -g grunt-cli (first time only)
    2. npm install -g bower 
6. npm install
7. bower install
8. grunt build 
9. Copy the **dist** folder to wherever you are running

When using the `html-design.zip` file, you can extract that to a working directory and you only have to run `grunt build`, it already contains the bower depedencies and grunt modules.
This can also be accomplished by running `npm start`, as the start script is configured to run the `grunt build` task.