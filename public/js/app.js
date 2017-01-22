
var app = angular.module("webscreenshot", [])

  .config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
  });
  
  
app.controller("MainCtrl", ["$scope", function($scope){
  
  var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;

  var regex = new RegExp(expression);

  var socket = io.connect();

  $scope.url = null;

  $scope.show_url = false;
  
  $scope.download_url = null;

  $scope.error = false;

  $scope.error_msg = null;

  $scope.submit = function(url){
    console.log(url);
    $scope.error = false;
    if(url.match(regex)){
      socket.emit("take screenshot", {url: url});
      $scope.loading = true;
      $scope.show_url = false;

    } else{
      $scope.error = true;
      $scope.error_msg = "Url is not valid";
    }
    
  }
  
  socket.on("screenshot done", function(url){
    console.log("screenshot done",url);
    $scope.$apply(function(){
      $scope.loading = false;
      $scope.show_url = true;
      $scope.download_url = url;
    });
  });

  socket.on("screenshot error", function(err){
    $scope.$apply(function(){
      $scope.loading = false;
      $scope.show_url = false;
      $scope.error = true;
      $scope.error_msg = "Url does not exist";
    });
  });
  
}]);