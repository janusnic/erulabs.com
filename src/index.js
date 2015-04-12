/* global document, window */
'use strict';

const postList = [
  'a new site',
  'a new site',
  'a new site',
  'a new site',
  'a new site',
  'a new site',
  'a new site',
  'a new site',
  'a new site',
];

const angular = require('angular');
require('angular-bootstrap');
require('./vendor/prism.js');

const ng = angular.module('erulabs', ['ui.bootstrap']);

ng.controller('BlogCtrl', function ($scope, $document, $http, $sce) {
  $scope.posts = [];
  //let elementCache = {};
  let postsShown = 0;
  const blogEle = document.getElementById('blog');
  let bounding = blogEle.getBoundingClientRect();
  let loading = false;

  function urlize (string) {
    return string.replace(/ /g, '_');
  }

  function loadPost (_id, position) {
    const id = urlize(_id);
    if (position === undefined) {
      position = $scope.posts.length;
    }
    loading = true;
    $http.get(`/assets/posts/${id}.html`).success(function (data, status) {
      if (status === 200) {
        $scope.posts[position] = $sce.trustAsHtml(data);
        bounding = blogEle.getBoundingClientRect();
        loading = false;
      }
    });
  }

  function loadNextPost () {
    const next = postList[postsShown];
    if (next) {
      loadPost(next, postsShown);
      postsShown++;
    } else {
      $scope.foundEnd = true;
    }
  }

  window.onscroll = function() {
    let height = Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    );
    console.log();
    if (window.pageYOffset + window.innerHeight >= height - 25) {
      if (!loading) {
        loadNextPost();
      }
    }
  };

  loadNextPost();
  loadNextPost();
  loadNextPost();
});
