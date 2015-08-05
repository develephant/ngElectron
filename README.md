# angElectron - AngularJS Electron Service

> An __AngularJS__ service module making it easier to interface with __Electron__.

####Using [__Amy__ App Stack](http://github.com/develephant/amy)? You can skip the "Install" and "Setup" sections.

## Install

Navigate to your _client-side(AngularJS)_ project folder, which may be different for your structure, and run:

```bash
cd my-project/client/lib
bower install develephant/ang-electron
```

## Setup

Add the `ang-electron.js` to your main Electron app __index.html__ page.

```html
<!-- Electron : index.html -->
<script type="text/javascript" src="./client/lib/ang-electron/ang-electron.js"></script>
```

Inject the __angElectron__ module in the main `app.js`
```javascript
// AngularJS : app.js
var app = angular.module('app', ['angElectron']);
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

Using the __ang-bridge__ in Electron, AngularJS can send and listen for messages from the main __host__ process.

> The main proccess/Chrome is generally referred to as the __"host"__ in the __ang-electron__ documentation.

When __ang-electron__ starts, AngularJS will listen for incoming messages from the __host__ and broadcast them throughout the AngularJS eco-system.  AngularJS code can listen for __host__ messages through the __$rootScope__ emitters and  __"electron-host"__ event type.


```javascript
app.run(['$rootScope', function($rootScope) {
  //listen for host messages
  $rootScope.$on('electron-host', function(evt, data) {
    console.log( data + " from HOST" );
  });
);
```

## Sending a message to the host

To send a message to the __host__ simply use the `send` method in the `electron` namespace:

```javascript
app.controller('myController', ['electron', function(electron) {
  electron.send("Hello from the client.");
})
```

__Important:__ _Electron needs the ng-bridge module initiated first, before communicating with AngularJS.  See the next section for setup details._

---

# Angular Bridge for Electron

The included __ang-bridge__ Electron module pairs with __ang-electron__ to create simple bi-directional communication between AngularJS and Electron using the built in `ipc` Electron functionality.

## Usage

Require the __ang-bridge__ module where you plan on using it:

```javascript
// Electron : index.js
var angular = require('./client/lib/ang-electron/ang-bridge');
```

Listen for messages from AngularJS in Electron:

```javascript
// Electron : index.js
app.on('ready', function() {
  angular.listen( function( msg ) {
    console.log( msg );
  })
});
```
Send a message to the AngularJS client:

```javascript
// Electron : index,js
angular.send("Hello from the host.");
```
---

## Calling Electron from AngularJS

One very useful feature of __ang-electron__ is the direct access to Electron, and included Node packages.

To quickly access the Electron `dialog` lib from the __host__ process, and open a prompt from AngularJS:

```javascript
mod.controller('myController',['electron', function(electron) {
  electron.dialog.showErrorBox('Opps', 'I did it again.');
}])
```

#### The following direct refs can be used in AngularJS controllers through the `electron` namespace:

__Custom__

- send
- db

__DiskDB__ is supported if the package is installed:

`npm install diskdb --save`

__Note:__ _If you are using the [Amy App Stack](https://develephant.github.io/amy), diskdb is already installed and configured._

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
angular.module('app', ['angElectron'])

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
angular.module('app', ['angElectron'])

.controller('dnsController', ['$scope','electron',
function($scope, electron) {
  electron.dns.resolve("http://google.com", function(err, addrs) {
    $scope.address = addrs[0];
    $scope.$apply();
  });  
}]);
```
## Integrate ang-electron into an existing project

> If you have an existing AngularJS Electron based project, you can integrate ang-electron pretty easily.  After following the steps below, make sure to read up on the `ang-electron` module in the documentation above.

With the terminal, navigate to your __AngularJS__ 'client' files and run:

`bower install develephant/ang-electron --save`

Now link the js files to the `index.html` of your __Electron__ project:

```html
<!-- Add the ng-electron module for AngularJS -->
<script type="text/javascript" src="client/lib/ang-electron/ang-electron.js"></script>
```

Inject the `angElectron` module dependency into your __AngularJS__ project:

```javascript
//Main app initialization
var app = angular.module('myApp', ['angElectron']);

//A controller
app.controller('myController', ['electron',
function(electron) {
  electron.send("Hello Host! From Client.");
}])
```

Make sure to use DI for `angElectron` in any __AngularJS__ modules you create that need access to __Electron__:

```javascript
var mod = angular.module('myModule', ['angElectron']);
```


## Functionality

__Electron__ includes __Node 11.x__ allowing you to use any
[__Node__ based modules](https://nodejs.org/docs/v0.11.0/api).

And of course the [__Electron API__ Documentation](http://electron.atom.io/docs/v0.30.0)

---

(c)2015 @develephant -
All rights reserved by the originals owners, maintainers, and creators.
