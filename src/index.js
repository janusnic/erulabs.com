/* global document, window */
'use strict';

const postList = [
  'post1',
  'post2'
];

const angular = require('angular');
require('angular-bootstrap');
const Prism = require('./vendor/prism.js');

const ng = angular.module('erulabs', ['ui.bootstrap']);

ng.controller('BlogCtrl', function ($scope, $document, $http, $sce) {
  $scope.posts = [];
  $scope.foundEnd = false;
  let postsShown = 0;
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
        setTimeout(function () {
          const eles = document.getElementById(id).getElementsByTagName('pre');
          for (let i = 0; i < eles.length; i++) {
            Prism.highlightElement(eles[i]);
          }
        }, 0);
        loading = false;
      }
    });
  }

  function loadNextPosts (n) {
    if (n === undefined) { n = 1; }
    for (let i = 0; i < n; i++) {
      const next = postList[postsShown];
      if (next) {
        loadPost(next, postsShown);
        postsShown++;
      }
    }
  }

  window.onscroll = function () {
    let height = Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    );
    if (window.pageYOffset + window.innerHeight >= height - 25) {
      if (!loading) {
        loadNextPosts();
      }
    }
  };
  loadNextPosts(2);
});
