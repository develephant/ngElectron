
# New Release: `electangular.js`

__Check out the latest release that supercedes `ngElectron`__

##### [electangular.js](https://github.com/develephant/electangular)

---

### ngElectron - AngularJS Electron Service

> An __AngularJS__ service module making it easier to interface with __Electron__.

## Install

Start by downloading the __ngElectron__ bundle: __[Download Here](https://github.com/develephant/ngElectron/archive/master.zip)__

Unzip the archive and move the `ng-electron.js` and `ng-bridge.js` to an accessable path.

## Setup

Add the `ng-electron.js` to your main Electron app __index.html__ page.

```html
<!-- Electron : index.html -->
<script type="text/javascript" src="./client/lib/ng-electron/ng-electron.js"></script>
```

Inject the __ngElectron__ module in the main `app.js`
```javascript
// AngularJS : app.js
var app = angular.module('app', ['ngElectron']);
```

Add the module to controllers by using the `electron` namespace.

```javascript
// AngularJS : controllers.js
app.controller('myController', ['electron', function(electron) {
  electron.dialog.showErrorBox('Oppps!','Looks like I messed something up...');
}]);
```

An Electron system menu created in AngularJS...

```javascript
// AngularJS : controllers.js
app.controller('myController', ['electron', function(electron) {

  //Get a reference to the Electron Menu class.
  var Menu = electron.menu

  var menu_tpl = [
    {
      label: 'Do Something'
      click: null
    }
  ]
  var menu = Menu.buildFromTemplate( menu_tpl );
  Menu.setApplicationMenu( menu );

}]);
```

## Communicating with Electron

Using the __ng-bridge.js__ in Electron, AngularJS can send and listen for messages from the main __host__ process.

> __The main process/Chrome is generally referred to as the "host" in the ngElectron documentation.__

When __ngElectron__ starts, AngularJS will listen for incoming messages from the __host__ and broadcast them throughout the AngularJS eco-system.  AngularJS code can listen for __host__ messages through the __$rootScope__ emitters and  __"electron-host"__ event type.


```javascript
app.run(['$rootScope', function($rootScope) {
  //listen for host messages
  $rootScope.$on('electron-host', function(evt, data) {
    console.log( data + " from HOST" );
  });
}]);
```

## Sending a message to the host

To send a message to the __host__ simply use the `send` method in the `electron` namespace:

```javascript
app.controller('myController', ['electron', function(electron) {
  electron.send("Hello from the client.");
}]);
```

__Important:__ _Electron needs the `ng-bridge.js` module initiated first, before communicating with AngularJS.  See the next section for setup details._

---

# Angular Bridge for Electron

The included __ng-bridge.js__ Electron module pairs with __ngElectron__ to create simple bi-directional communication between AngularJS and Electron using the built in `ipc` Electron functionality.

## Usage

Require the __ng-bridge.js__ module where you plan on using it:

```javascript
// Electron : index.js
var angular = require('./client/lib/ng-electron/ng-bridge');
```

Listen for messages from AngularJS in Electron:

```javascript
// Electron : index.js
app.on('ready', function() {
  angular.listen( function( msg ) {
    console.log( msg );
  });
});
```
Send a message to the AngularJS client:

```javascript
// Electron : index,js

// Specify a BrowserWindow
angular.send("Hello from the host.", mainWindow);

// If no BrowserWindow is specified, ng-bridge will attempt to capture the window that is focused in the application.
angular.send("Hello from the host.");
```
**Note** If a window is neither specified, or found, the message will not send to the client.

---

## Calling Electron from AngularJS

One very useful feature of __ngElectron__ is the direct access to Electron, and included Node packages.

To quickly access the Electron `dialog` lib from the __host__ process, and open a prompt from AngularJS:

```javascript
mod.controller('myController',['electron', function(electron) {
  electron.dialog.showErrorBox('Opps', 'I did it again.');
}]);
```

#### The following direct refs can be used in AngularJS controllers through the `electron` namespace:

__Custom__

- send
- db

__DiskDB__ is supported if the package is installed:

`npm install diskdb --save`

__ShellJS__ is also supported if the package is installed:

`npm install shelljs --save`


__Note:__ _If you are using the [Amy App Stack](https://develephant.github.io/Amy), diskdb is already installed and configured._

__Electron__

- app
- browserWindow
- clipboard
- dialog
- menu
- menuItem
- nativeImage
- powerMonitor
- protocol
- require
- screen
- shell
- tray

_Using an Electron module in AngularJS_

```javascript
// AngularJS
angular.module('app', ['ngElectron'])

.controller('myController', ['electron', function(electron) {
  //Some methods require a class ref first
  //which you can do through the electron namespace.
  var BrowserWindow = electron.browserWindow;
  var win = new BrowserWindow( args );
}])

.controller('dockController', ['electron', function(electron) {
  //And others can be called directly
  electron.app.dock.bounce();
}])
```

__Node__

- buffer
- childProcess
- crypto
- dns
- emitter
- fs
- http
- https
- net
- os
- path
- querystring
- url
- zlib

_Using a Node module in AngularJS_

```javascript
// AngularJS
angular.module('app', ['ngElectron'])

.controller('dnsController', ['$scope','electron',
function($scope, electron) {
  electron.dns.resolve("http://google.com", function(err, addrs) {
    $scope.address = addrs[0];
    $scope.$apply();
  });
}]);
```
## Integrate ngElectron into an existing project

> If you have an existing AngularJS Electron based project, you can integrate ngElectron pretty easily.  After following the steps below, make sure to read up on the `ngElectron` module in the documentation above.

With the terminal, navigate to your __AngularJS__ 'client' files and run:

`bower install develephant/ng-electron --save`

Now link the js files to the `index.html` of your __Electron__ project:

```html
<!-- Add the ng-electron module for AngularJS -->
<script type="text/javascript" src="client/lib/ng-electron/ng-electron.js"></script>
```

Inject the `ngElectron` module dependency into your __AngularJS__ project:

```javascript
//Main app initialization
var app = angular.module('myApp', ['ngElectron']);

//A controller
app.controller('myController', ['electron',
function(electron) {
  electron.send("Hello Host! From Client.");
}])
```

Make sure to use DI for `ngElectron` in any __AngularJS__ modules you create that need access to __Electron__:

```javascript
var mod = angular.module('myModule', ['ngElectron']);
```

---

## Contributors

:construction_worker: __[MarkRabey](https://github.com/MarkRabey)__
:construction_worker: __[dgoradia](https://github.com/dgoradia)__
:construction_worker: __[nicam](https://github.com/nicam)__
:construction_worker: __[ojwebtech](https://github.com/ojwebtech)__

---

(c)2015-16 C. Byerley @develephant :elephant:
All rights reserved by the originals owners, maintainers, and creators.
