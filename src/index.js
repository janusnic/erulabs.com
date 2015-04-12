'use strict';

const angular = require('angular');
require('angular-bootstrap');
require('./vendor/prism.js');

const ng = angular.module('erulabs', ['ui.bootstrap']);

ng.controller('BlogCtrl', function ($scope) {
  $scope.test = 'foo';
});
