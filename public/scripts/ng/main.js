var myApp = angular.module('myApp', ['autocomplete', 'infinite-scroll','angularMoment','ngRoute']).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', 
    {
      templateUrl: '/scripts/ng/partials/search.html', 
      controller: 'SearchController'
    });
  
  $routeProvider.when('/recorrido/:id', 
    {
      templateUrl: '/scripts/ng/partials/clientes.html', 
      controller: 'ClientController'
    });
  
   $routeProvider.otherwise('/');
}]);
myApp.run(function(amMoment) {
    amMoment.changeLocale('es');
});
myApp.controller('SearchController', function($scope,$rootScope,$location, $http){

      var url = '/api/clients/all';
        $http.get(url).success(function(data) {
          console.log(data);
        $scope.clients = data;
      });
        $scope.gotoClient = function(c){  
          $location.path("/cliente/" + c.id);
        };

    
});
myApp.controller('ClientController', function($scope,$rootScope,$routeParams, $location, $http){


      var url = '/api/clients/'+ $routeParams.id;
        $http.get(url).success(function(data) {
          console.log(data);
      
        $scope.recorridos = data;
      });

        

});





