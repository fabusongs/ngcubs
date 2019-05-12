//Add Firebase Database REST API

(function() {
  'use strict';

  var app = angular.module('app', []).run(function() {
    console.log('Toggle the "Basic Mode" and "Promise Mode" buttons for messages and Objects');
    console.log('App fired');
  });

  app.factory('cubService', [
    '$http', '$q',
    function cubService($http, $q) {
      console.log('2018 Cubs service wip');

      var service = {
        cubs: [],
        getCubs: getCubs,
        getCubsBasic: getCubsBasic
      };
      return service;

      function getCubs() {
        var def = $q.defer();

        $http.get("")
          .success(function(data) {
            service.cubs = data;
            def.resolve(data);
            console.log('Cubs .. "basic mode $http" returned to controller.', data);
          })
          .error(function() {
            def.reject("Failed to get Cubs");
          });

        return def.promise;
      }

      function getCubsBasic() {
        return $http.get("http://www.touchtap.net/myapi/cubs10best.json")
          .success(function(cubs) {
            service.cubs = cubs;
          //alert('See console log for promises kept.');
            console.log('The 2016 Cubs win the World Series? - That\'s the "promise" in Chicago! (Unless you\'re a White Sox fan.)');
          });
      }
    }
  ]);

  app.controller('cubsController', [
    '$scope', 'cubService',
    function cubsController($scope, cubService) {
      console.log('Cubs controller fired');
      var vm = this;
      vm.cubs = [];
      vm.basicMode = true;

      vm.getCubs = function() {
        cubService.getCubs()
          .then(function(cubs) {
              for (var i = 0; i < cubs.length; i++) {
                cubs[i].cubName += "   ...   $q ";
              }
              vm.cubs = cubs;
              console.log('Cubs ... "promise mode $q" returned to controller.', cubs);
            },
            function() {
              console.log('Cubs call failed.');
            });
      };

      vm.getCubsBasic = function() {
        cubService.getCubsBasic()
          .success(function(cubs) {
            for (var i = 0; i < cubs.length; i++) {
              cubs[i].cubName += "";
            }
            vm.cubs = cubs;
            console.log('Cubs returned to controller.', vm.cubs);
          })
          .error(function(http, status, fnc, httpObj) {
            console.log('Cubs retrieval failed.', http, status, httpObj);
          });
      };

      vm.toggleBasicMode = function(mode) {
        vm.basicMode = mode;
        if (vm.basicMode)
          vm.getCubsBasic();
        else
          vm.getCubs();
      }

      if (vm.basicMode)
        vm.getCubsBasic();
      else
        vm.getCubs();
    }
  ]);
})();
