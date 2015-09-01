/**
* A Node module for Electron ipc messaging.
* Talks with the AngularJS ngElectron module.
* Info: https://develephant.github.io/ngElectron
* See also: https://develephant.gitgub.io/amy
**/
var angularBridge = new Object();

angularBridge.send = function ( msg, bw ) {
  var msg = msg;
  bw = bw || require('browser-window').getFocusedWindow();

  if (bw) {
    bw.webContents
      .send('ELECTRON_BRIDGE_CLIENT', msg);
  }
}
angularBridge.listen = function ( _listener ) {
  var _listener = _listener;
  var i = require('ipc')
  i.on('ELECTRON_BRIDGE_HOST', function( evt, msg ) {
      _listener( msg );
  });
}

module.exports = angularBridge;
