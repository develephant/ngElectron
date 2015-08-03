'use strict';
var mod = angular.module('ngElectron', [])

const electron_host = 'ELECTRON_BRIDGE_HOST';
const electron_client = 'ELECTRON_BRIDGE_CLIENT';
const electron_host_id = 'electron-host';

const ipc = require('ipc');

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
  o.send            = function( data ) {
    console.log('send '+data);
    ipc.send(electron_host, data);
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

  return o;
}]);

mod.run(['$rootScope',
function($rootScope) {
  console.log('run');

  ipc.on(electron_client, function( data ) {
    $rootScope.$emit(electron_host_id, data);
  });

  $rootScope.$on(electron_host_id, function( evt, msg ) {
    console.log( '--> ' + msg );
  });
}]);
