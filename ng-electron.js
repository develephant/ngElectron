/**
 * ngElectron service for AngularJS
 * (c)2015 C. Byerley @develephant
 * http://develephant.github.io/ngElectron
 * See also: https://develephant.gitgub.io/amy
 * Version 0.4.0
 */
'use strict';

const electron_host = 'ELECTRON_BRIDGE_HOST';
const electron_client = 'ELECTRON_BRIDGE_CLIENT';
const electron_host_id = 'electron-host';
const db_silo = 'client/data';

const ipc = require('ipc');
const diskdb = require('diskdb');

angular.module('ngElectron', [])

.factory("electron", [function() {
  var o = new Object();

  //ipc -> host (main process)
  o.send = function( data ) {
    ipc.send(electron_host, data);
  };

  //diskdb
  o.db = function( collection ) {
    if ( diskdb ) {
      var collection_arr = [];
      if (typeof collection == 'object') {
        collection_arr = collection;
      } else if (typeof collection == 'string') {
        collection_arr.push( collection );
      }

      return diskdb.connect(db_silo, collection_arr);
    }

    return 'diskdb is not installed and/or configured.'
  };

  //remote require
  o.require         = require('remote').require;

  //Electron api
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
  ipc.on(electron_client, function( data ) {
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
