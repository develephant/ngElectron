/**
* A Node module for the Electron ipc process.
* Talks with the Angular ng-electron module.
**/
module.exports = exports = AngularBridge = {
  //Send a message to the page from process
  send: function( msg ) {
    require('browser-window').getFocusedWindow().webContents.send('ELECTRON_BRIDGE_CLIENT', msg);
  },
  //Listen for page messages to process
  listen: function( _callback ) {
    require('ipc').on('ELECTRON_BRIDGE_HOST', function( evt, msg ) {
      _callback( msg );
    });
  }
}
