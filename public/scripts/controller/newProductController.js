/**
 * Created by Komal on 20/05/15.
 */
var app=angular.module('newProduct',[]);
app.controller('NewProduct',['$scope','$http',function($scope,$http){

    var refresh= function () {

        $http.get('/feature').success(function (response) {
            console.log('i recieved the Data');
            $scope.productFeature = response;

        });
    }
    refresh();

    $scope.saveProduct=function(product){
        console.log($scope.product);
    }
    $scope.changeF = function () {
    var myStyle= '#' + $scope.abc;
    console.log(myStyle);
  }

    $scope.selection=[];
    $scope.toggleSelection = function toggleSelection(id) {
        var idx = $scope.selection.indexOf(id);

        // is currently selected
        if (idx > -1) {
            $scope.selection.splice(idx, 1);
        }

        // is newly selected
        else {
            $scope.selection.push(id);
        }
    };
}
]);