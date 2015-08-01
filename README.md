# AngularJS Electron

####An __AngularJS__ module making it easier to interface with __Electron__.

## Install

Navigate to your project folder and run:

```bash
bower install develephant/ng-electron
```

## Setup

Add the `ng-electron.js` and `angular-bridge.js` to your main app index html page.  They will be both be in your clients project `lib` folder in __ng-electron__.

```html
<!-- index.html -->
<script type="text/javascript" src="./client/lib/ng-electron/ng-electron.js"></script>
<script type="text/javascript" src="./client/lib/ng-electron/angular-bridge.js"></script>
```

Inject the __ngElectron__ module in the main `app.js`
```javascript
// AngularJS -> app.js
var app = angular.module('app', ['ngElectron']);
```

Add the module to controllers by using the `electron` namespace.

```javascript
// controllers.js
app.controller('myController', ['electron', function(electron) {
  electron.dialog.showErrorBox('Oppps!','Looks like I messed something up...');
}]);
```

An Electron system menu created in AngularJS...

```javascript
// controllers.js
app.controller('myController', ['electron', function(electron) {
  //ref electron menu
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

After making sure to have the __angular-bridge__ Electron package installed and configured (see below), AngularJS can send and listen for messages from the main Electron process. The main proccess/browser is generally referred to as the __"host"__ in the __ng-electron__ api.

When __ng-electron__ starts it will automatically create a listener waiting for messages from the __host__ and broadcast them throughout the AngularJS eco-system.  AngularJS can listen in for __host__ messages through the __`electron`__ namespace.  As an additional option, you can also use the __`$rootScope.$electron`__, or __`$scope.$electron`__ object anywhere in the AngularJS codebase, specifically listening for the __"electron-host"__ event type.

```javascript
app.controller('myController', ['$scope', function($scope) {
  //listen for host messages
  $scope.$electron.on('electron-host', function(evt, data) {
    console.log( data + " from HOST" );
  });
);
```

Best practice would be to run just one __host__ listener and emit your events as needed, like a traffic cop. Of course you can initiate as many listeners as you need individually, just be careful of memory leaks or over-consumption.  The following demonstrates another method of listening to the __host__ in a controller.  In this case you must include __ngElectron__ and use the `electron.host` namespace.

```javascript
// AngularJS
var mod = angular.module('ControllersLib', ['ngElectron']);
//Controller A
mod.controller('aController', ['electron',
function(electron) {
  electron.host.listen( function( msg ) {
    console.log("Just got the latest HOST message in aController.")
  });
}]);
//Controller B
mod.controller('bController', ['electron',
function(electron) {
  electron.host.listen( function( msg ) {
    console.log("Just got the latest HOST message in bController.")
  });
}]);
```

## Sending a message to the host

To send a message to the __host__ use the `host.send` method:

```javascript
app.controller('myController', ['electron', function(electron) {
  electron.host.send("Hello from the client.");
})
```

___Note: Electron needs the __angular-bridge.js__ file to be included for communicating with AngularJS.___

---

## Calling Electron from AngularJS

One additional, though very useful feature of __ng-electron__ is the direct access to Electron, and various Node packages, for example to quickly access the Electron `dialog` lib from the __host__ process and open a prompt:

```javascript
mod.controller('myController',['electron', function(electron) {
  electron.dialog.showErrorBox('Opps', 'I did it again.');
}])
```

#### The following direct refs can be used in AngularJS controllers through the `electron` namespace:


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
app.controller('myController', ['electron', function(electron) {
  //Some methods require a class ref
  var BrowserWindow = electron.browserWindow;
  var win = new BrowserWindow( args );
}]);

app.controller('dockController', ['electron', function(electron) {
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
app.controller('dnsController', ['$scope','electron',
function($scope, electron) {
  electron.dns.resolve("http://google.com", function(err, addrs) {
    $scope.address = addrs[0];
    $scope.$apply();
  });  
}]);
```
---

__Host/Client (communication)__

- send
- listen

_See the section __Communicating with Electron__ above for more information on using the `host` namespace._


# Angular Bridge for Electron

The included __angular-bridge__ package pairs with __ng-electron__ to create simple bi-directional communication between AngularJS and Electron using the built in `ipc` Electron package.

## Setup

Get the __angular-bridge.js__ and place it wherever you put other Electron project dependancies, for example `lib`.

---

__Import the `angular-bridge.js` javascript after all the other scripts in the project html entry point, for example `index.html`.__

```html
<!-- index.html -->
<script type="text/javascript" src="./lib/angular-bridge.js"></script>
```

__Add the following to the main javascript entry point for the project, for example `index.js`.__

Update or add the following:

```javascript
// index.js
app.on('ready', function() {
  var angular = require('angular-bridge');
  angular.listen( function( data ) {
    console.log( "A Message from AngularJS!")
  })
})
```

>The host process (browser) will now listen for messages from AngularJS.

## Sending messages

__To send a message or a data object to AngularJS, use the send method:__

```javascript
var angular = require('angular-bridge')
angular.send('Sending a message to AngularJS.')
```
