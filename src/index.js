/* global document, window */
'use strict';

const angular = require('angular');
require('angular-bootstrap');
require('./vendor/prism.js');

const ng = angular.module('erulabs', ['ui.bootstrap']);

ng.controller('BlogCtrl', function ($scope, $document) {
  let doc = document.documentElement;
  $document.on('scroll', function() {
    let left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
    let top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
    console.log('Document scrolled to ', left, top);
  });

  $scope.test = 'foo';
});
