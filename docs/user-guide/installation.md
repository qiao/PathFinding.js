# Installation
This section describes how to install PathFinding.js.

## Using Package Managers
PathFinding.js supports installation using npm and bower command line tools.

### For Server
[Node.js](http://nodejs.org/) is an environment for running javascript on the
server. [Download](http://nodejs.org/download/) and install Node.js for your OS
and confirm that it works from the command line:

```bash
node -v
```

If Node.js was installed correctly this should print the installed version of]
Node.js.

Node.js comes with a [Node Package Manager](https://www.npmjs.com/) command line
tool called _npm_. It is used to install packages for Node.js. Check that it
works:

```bash
npm -v
```

This should print the installed version of npm.

npm installs the packages in the current folder by default. Make sure you are
in your project folder before continuing:

```bash
cd <my_new_project>
```

Now you are ready to install PathFinding.js. The npm command to install
PathFinding.js is:

```bash
npm install pathfinding
```

This will create a _node_modules_ folder inside the my_new_project folder.
PathFinding.js is now installed in the _pathfinding_ folder inside the
node_modules folder.

### For Client
[Bower](http://bower.io/) is a front-end package manager. Install it by running
the command:

```bash
npm install -g bower
```

Confirm that you can run the bower command:

```bash
bower -v
```

This should print the installed version of bower.

Navigate to your project folder:

```bash
cd <my_new_project>
```

Install pathfinding:

```bash
bower install pathfinding
```

This will create a _bower_components_ folder inside the my_new_project folder.
PathFinding.js is now installed in the pathfinding folder inside the
bower_components folder.

## Manual Installation
If you want to use the latest development version you will have to install
PathFinding.js manually.

### For Server
[Download](https://github.com/qiao/PathFinding.js/archive/master.zip) the zip
from github and extract the contents into the node_modules folder. Don't forget
to rename the extracted folder from PathFinding.js-master to pathfinding.

### For Client
[Download](https://github.com/qiao/PathFinding.js/archive/master.zip) the zip
from github, extract it in a temporary folder and navigate to this folder:

```bash
cd <temp_folder>
```

Now install all the dependencies of PathFinding.js:

```bash
npm install
```

Now compile the browser builds:

```bash
gulp compile
```

This will create _pathfinding-browser.js_ and _pathfinding-browser.min.js_ files
in the temp_folder/lib folder. You can use these files in your project now.