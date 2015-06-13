var myApp = angular.module('myApp', ['autocomplete', 'infinite-scroll','angularMoment','ngRoute']).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', 
    {
      templateUrl: '/scripts/ng/partials/search.html', 
      controller: 'HomeController'
    });
  
  $routeProvider.when('/recorrido/:id', 
    {
      templateUrl: '/scripts/ng/partials/clientes.html', 
      controller: 'RecorridosController'
    });
  
   $routeProvider.otherwise('/');
}]);
myApp.run(function(amMoment) {
    amMoment.changeLocale('es');
});
myApp.controller('HomeController', function($scope,$rootScope,$location, $http){

      var url = '/json/venues.json';
        $http.get(url).success(function(data) {
          console.log(data);
        $scope.recorridos = data;
      });
        $scope.gotoRecorrido = function(c){  
          $location.path("/recorrido/" + c.id);
        };

    
});
myApp.controller('RecorridosController', function($scope,$rootScope,$routeParams, $location, $http){


      var url = '/api/clients/'+ $routeParams.id;
        $http.get(url).success(function(data) {
          console.log(data);
      
        $scope.recorridos = data;
      });

        

});





