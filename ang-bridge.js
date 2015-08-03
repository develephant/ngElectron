/**
* A Node module for the Electron ipc process.
* Talks with the Angular ng-electron module.
**/

var angularBridge = new Object();

angularBridge.send = function ( msg ) {
  var msg = msg;
  var bw = require('browser-window')
  .getFocusedWindow()
  .webContents
  .send('ELECTRON_BRIDGE_CLIENT', msg);
}
angularBridge.listen = function ( _listener ) {
  var _listener = _listener;
  var i = require('ipc')
  .on('ELECTRON_BRIDGE_HOST', function( evt, msg ) {
      _listener( msg );
  });
}

module.exports = angularBridge;
