/**
 * Created by Komal on 25/06/15.
 */
var app = angular.module('login', []);
app.controller('loginCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.login = function(log_data) {
        console.log(log_data);
        $http.post('/login', log_data).success(function(response) {
            if (response === 'done') {
                window.location.href = 'Home.html';
            }
        });
    };
}]);