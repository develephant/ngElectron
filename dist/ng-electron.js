var mod = angular.module('ngElectron', [])

mod.factory("electron", ['$rootScope',
function($rootScope) {
  var o             = new Object();

  //remote require
  o.require         = require('remote').require;

  //Electron Internal
  o.app             = o.require('app');
  o.browserWindow   = o.require('browser-window');
  o.clipboard       = o.require('clipboard');
  o.dialog          = o.require('dialog');
  o.menu            = o.require('menu');
  o.menuItem        = o.require('menu-item');
  o.nativeImage     = o.require('native-image');
  o.powerMonitor    = o.require('power-monitor');
  o.protocol        = o.require('protocol');
  o.screen          = o.require('screen');
  o.shell           = o.require('shell');
  o.tray            = o.require('tray');

  //ipc -> host (main process)
  o.host             = new Object();
  o.host.send        = function( data ) {
    require('ipc').send('ELECTRON_BRIDGE_HOST', data);
  };
  o.host.listen      = function( _listener ) {
    require('ipc').on('ELECTRON_BRIDGE_CLIENT', function( data ) {
      _listener( data );
    })
  };

  //Node 11 (abridged)
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

  // If you don't want ngElectron available
  // on the $rootScope, comment out the following
  $rootScope.$electron = o;

  return o;
}]);

mod.run(['$rootScope','electron',
function($rootScope, electron) {
  electron.host.listen(function(msg) {
    $rootScope.$broadcast('electron-host', msg);
  })
}]);
