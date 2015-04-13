/* global document, window */
'use strict';

const angular = require('angular');
const Prism = require('./vendor/prism.js');

const ng = angular.module('erulabs', []);

ng.controller('BlogCtrl', function ($scope, $document, $http, $sce) {
  // To improve caching, we'll load this from a separate file via an HTTP call.
  // That way this file doesn't need to change when posting new blog posts.
  // And therefore, can stay cached much longer.
  $scope.posts = {};
  $scope.foundEnd = false;
  let postsShown = 0;
  let loading = false;

  $scope.urlize = function urlize (string) {
    return string
      .replace(/ /g, '_');
  };
  $scope.unurlize = function urlize (string) {
    return string
      .replace(/_/g, ' ');
  };


  function loadPost (postObj, callback) {
    if (typeof postObj === 'string') {
      postObj = { name: postObj };
    }
    const id = postObj.name;
    const canon = $scope.unurlize(postObj.name);
    loading = true;
    $http.get(`/assets/posts/${id}.html`).success(function (data, status, headers) {
      if (status === 200) {
        let date = headers()['last-modified'].split(' ');
        $scope.postList[id].title = canon;
        if ($scope.postList[id].date === undefined) {
          $scope.postList[id].date = `${date[2]} ${date[1]}, ${date[3]}`;
        }
        $scope.postList[id].html = $sce.trustAsHtml(data);
        $scope.postList[id].visible = true;
        setTimeout(function () {
          const eles = document.getElementById(id).getElementsByTagName('pre');
          for (let i = 0; i < eles.length; i++) {
            Prism.highlightElement(eles[i]);
          }
        }, 0);
        if (callback) {
          callback();
        }
        loading = false;
      } else if (status === 404) {
        console.log('404');
      } else {
        console.log(status);
      }
    });
  }

  function loadNextPosts (n) {
    if (n === undefined) { n = 1; }
    const keys = Object.keys($scope.postList);
    for (let i = 0; i < n; i++) {
      const next = keys[postsShown];
      if (next) {
        loadPost(next);
        postsShown++;
      }
    }
  }

  function searchByCategory (category) {
    let matches = 0;
    for(let curr in $scope.postList) {
      let thisPost = $scope.postList[curr];
      if (thisPost && thisPost.categories && thisPost.categories.indexOf(category) > -1) {
        loadPost(curr);
        matches++;
      } else {
        $scope.postList[curr].visible = false;
      }
    }
    if (matches === 0) {
      $scope.sorry = `No posts match "${category}"`;
    }
  }

  $http.get('/assets/posts/posts.json').success(function (data) {
    $scope.postList = data.posts;
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

    let query = window.location.pathname.split('/')[1];
    if (query) {
      if (query === 'resume') {
        $scope.resume = true;
      } else if ($scope.postList[query]) {
        loadPost({
          name: query
        }, 0, function () {
          console.log('ok i loaded it');
        });
      } else {
        searchByCategory(query);
      }
    } else {
      loadNextPosts(2);
    }
  });
});
