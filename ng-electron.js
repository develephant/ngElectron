/**
 * ngElectron service for AngularJS
 * Coryright 2015-16 C. Byerley @develephant
 * http://develephant.github.io/ngElectron
 * Version 0.5.1
 */
'use strict';

const electron_host = 'ELECTRON_BRIDGE_HOST';
const electron_client = 'ELECTRON_BRIDGE_CLIENT';
const electron_host_id = 'electron-host';

const ipc = require('electron').ipcRenderer;

angular.module('ngElectron', [])

.factory("electron", [function() {
  var o = new Object();

  //ipc -> host (main process)
  o.send = function( data ) {
    ipc.send(electron_host, data);
  };

    //remote require
  o.require         = require('electron').remote.require;

  //Electron api
  o.app             = require('electron').remote.app;
  o.browserWindow   = require('electron').remote.BrowserWindow;
  o.clipboard       = require('electron').remote.clipboard;
  o.dialog          = require('electron').remote.dialog;
  o.menu            = require('electron').remote.Menu;
  o.menuItem        = require('electron').remote.MenuItem;
  o.nativeImage     = require('electron').remote.NativeImage;
  o.powerMonitor    = require('electron').remote.PowerMonitor;
  o.protocol        = require('electron').remote.Protocol;
  o.screen          = require('electron').remote.Screen;
  o.shell           = require('electron').remote.Shell;
  o.tray            = require('electron').remote.Tray;
  o.capturer        = require('electron').desktopCapturer;

  //Node 11 (abridged) api
  o.buffer          = o.require('buffer');
  o.childProcess    = o.require('child_process');
  o.crypto          = o.require('crypto');
  o.dns             = o.require('dns');
  o.emitter         = o.require('events').EventEmitter;
  o.fs              = o.require('fs');
  o.http            = o.require('http');
  o.https           = o.require('https');
  o.net             = o.require('net');
  o.os              = o.require('os');
  o.path            = o.require('path');
  o.querystring     = o.require('querystring');
  o.url             = o.require('url');
  o.zlib            = o.require('zlib');

  return o;
}])

// Start listening for AngularJS ipc messages
.run(['$rootScope','electron',
function($rootScope, electron) {
  console.log('ngElectron has joined the room.');
  //Start listening for host messages
  ipc.on(electron_client, function(event, data) {
    //Event type: 'electron-host'
    $rootScope.$broadcast(electron_host_id, data);
  });

  /*
  Add $electron as a special root property.
  Though generally not a good practice,
  it helps protect the electron instance
  and we are in a more closed enviroment
  as it is.
  */
  $rootScope.$electron = electron;
}]);
