var app=angular.module('feature',[]);
app.controller('myController',['$scope','$http', function($scope,$http){

    var refresh= function () {

        $http.get('/feature').success(function (response) {

            $scope.feature = response;

        });
    }
    refresh();


    $scope.add=function(featureAdds)
    {
        $http.post('/feature',featureAdds).success(function(response)
        {

        });
        location.reload();
    }

    $scope.remove=function(id)
    {
        $http.delete('/feature/'+id).success(function (response) {
            refresh();
        });
    }

    $scope.edit=function(id)
    {

        $http.get('/feature/'+id).success(function (response) {
            $scope.featureAdd=response;
        });
    }

    $scope.update=function(featureAdd){

        $http.put('/feature/'+featureAdd._id,featureAdd).success(function (response) {
            refresh();
        });
    }

}]);

