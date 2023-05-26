/*

scripts on the node.js project that helps us 
in running the file

npm
node package manager, installed by default by node js
also to install third-party packages
and initialize the node project and add extra features

third-party packages,
codes that are not included into nodejs
so not reinvent the wheel
could help with parsing incoming requests, validating user input
packages like: express, body-parser
packages are stored in the npm repository
a cloud repo
installed and manage with the npm tool



//////Start npm script
project directory
# npm init

will ask for package name etc.
and out put a json file with configuration information

can add a start script in the json file
so when # npm start this terminal script always run

  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node createUser.js",
    "start-myServer": "node createUser.js"

  },


where start is a reserved name
    # npm start
start-myServer is a custom name
    # npm run start-myServer

helpful so when the code is shared
people do not have to figure out which file is the entry file
and just run npm start in terminal


//////auto-save server code and restart


# npm install package-name 

check the package description on the npm library

development dependency because only used during the development process
so once the app is installed on a real server, we do not need it there
as we will not change its code dynamically

//install as a production dependency 
# npm install package-name --save 

//install as a development dependency
# npm install package-name --save-dev

//install globally so can be used anywhere not just in the project
# npm install package-name -g


## npm install nodemon --save-dev

install the package in the node_modules directory
with its dependencies
this will update package.json
and add package-lock.json, and node_modules directory

## npm install
will look for the dependencies in package.json 
and install any updates available

can delete the node_modules directory
and when start working on the nodejs project again 
run npm install to install the packages


once the a package is installed can be used in code
# npm install --save express-session
//const sessions = require ("express-session");







*/