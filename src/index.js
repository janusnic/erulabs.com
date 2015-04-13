/* global document, window */
'use strict';

// A list of posts.
// To improve caching, we'll load this from a separate file via an HTTP call.
// That way this file doesn't need to change when posting new blog posts.
// And therefore, can stay cached much longer.
let postList = [];

const angular = require('angular');
const Prism = require('./vendor/prism.js');

const ng = angular.module('erulabs', []);

ng.controller('BlogCtrl', function ($scope, $document, $http, $sce) {
  $scope.posts = [];
  $scope.foundEnd = false;
  let postsShown = 0;
  let loading = false;

  $scope.urlize = function urlize (string) {
    return string
      .replace(/ /g, '_')
      .replace(/(\!|\"|\')/g, '');
  };

  function loadPost (postObj, position) {
    const id = $scope.urlize(postObj.name);
    if (position === undefined) {
      position = $scope.posts.length;
    }
    loading = true;
    $http.get(`/assets/posts/${id}.html`).success(function (data, status, headers) {
      if (status === 200) {
        let date = headers()['last-modified'].split(' ');
        $scope.posts[position] = {
          title: postObj.name,
          date: `${date[2]} ${date[1]}, ${date[3]}`,
          categories: postObj.categories,
          html: $sce.trustAsHtml(data)
        };
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

  $http.get('/assets/posts/posts.json').success(function (data) {
    postList = data.posts;
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
});
