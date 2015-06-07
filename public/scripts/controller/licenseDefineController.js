/**
 * Created by KSingh1 on 6/2/2015.
 */
var app=angular.module('license',[]);
var productSelect=[];
var newMemArray=[];
app.controller('licenseController',['$scope','$http',function($scope,$http)
{
    var productRefresh= function () {
        $http.get('/getProduct').success(function(response)
        {
            $scope.productDB = response;
        });
    }
    productRefresh();
    $scope.select=function(prdcts)
    {
        productSelect.push(prdcts);
        $scope.prdctDisplay=productSelect;
    }
    $scope.newMem=function(mem){
        newMemArray.push(mem);
        $scope.newMemDisplay=newMemArray;
    }
}
]);