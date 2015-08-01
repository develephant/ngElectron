/**
* A Node module for the Electron ipc process.
* Talks with the Angular ng-electron module.
* 2015 Chris Byerley
* License: MIT
**/
module.exports = exports = AngularBridge = {
  /**
   * Send a message to the Client.
   */
  send: function( msg ) {
    require('browser-window').getFocusedWindow().webContents.send('ELECTRON_BRIDGE_CLIENT', msg);
  },

  /**
   * Listen for events from the Host.
   */
  listen: function( _callback ) {
    require('ipc').on('ELECTRON_BRIDGE_HOST', function( evt, msg ) {
      _callback( msg );
    });
  }
}
