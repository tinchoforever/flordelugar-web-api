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
          for (var i = 0; i < data.length; i++) {
            var d = data[i]; 
            d.assets.googleMaps = "https://maps.googleapis.com/maps/api/staticmap?center="+ d.location.lat + ","+ d.location.on + "&zoom=14&size=200x200";
            d.assets.googleMaps+= "&markers=color:blue%7Clabel:C%7C" + d.location.lat +  "," + d.location.lon;
            d.assets.streetView = "https://maps.googleapis.com/maps/api/streetview?size=200x200&location=" + d.location.lat + ","+ d.location.lon + "&heading=100"
          };
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





