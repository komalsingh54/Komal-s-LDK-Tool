/**
 * Created by Komal on 20/05/15.
 */
var app=angular.module('newProduct',[]);
var uid = 1;
var uidp = 1;
app.controller('NewProduct',['$scope','$http',function($scope,$http){

    $scope.productArray = [];//[{id:-1, 'featureID':'','featureName':'','featureDescription':'','licenceType':'','count':'','concurrentInstances':'','atOrderTime':'','countCriteria':'','remotedesktop':'','network':'','vm':''}];
    var emp=[];
    var productRefresh= function () {
        $http.get('/getProduct').success(function(response)
        {
            $scope.productDB = response;
        });
    }
    productRefresh();

    $scope.removeProduct=function(id)
    {

        $http.delete('/getProduct/'+id).success(function (response) {

            productRefresh();
        });
    }

    var refresh= function () {

        $http.get('/feature').success(function (response) {

            $scope.productFeature = response;

        });
    }
    refresh();

    productRefresh();


    $scope.configureFeature=function(feature){

        $scope.name=feature;

    }

    $scope.featureDefine=function(name)
    {

        if ($scope.name.id==null) {
            $scope.name.id=uidp++;
            $scope.productArray.push($scope.name);
        }
        else{
            for(i in $scope.productArray){
                if ($scope.productArray[i].id == $scope.name.id) {
                    $scope.productArray[i] = $scope.name;
                }
            }
        }
        $scope.name={};
    }
    $scope.editProduct = function(id)
    {
        for(i in $scope.productArray){
            if ($scope.productArray[i].id == id) {
                $scope.name=angular.copy($scope.productArray[i]);
            }
        }
    }
    $scope.deleteProduct = function(id){
        for(i in $scope.productArray)
        {
            if($scope.productArray[i].id == id){
                $scope.productArray.splice(i,1);
                $scope.name={};
            }
        }
    }
    $scope.forRefresh = function()
    {
        productRefresh();
    }

    $scope.showDetails=function(id)
    {
        $http.get('/oneProduct/'+id).success(function (response) {
            $scope.OneProducts=response;
        });
    }

    $scope.addProduct=function(product,productArray)
    {
        //var TableData;
        var productName = product.productName;
        var productId = product.productID;
        var productDescription = product.productDescription;
        var productLocking = product.productLockingType;
        emp=emp;
        for(var i in productArray)
        {
            emp[i]={
                "featureID":productArray[i].featureID,
                "featureName":productArray[i].featureName,
                "featureDescription":productArray[i].featureDescription,
                "licenceType":productArray[i].licenceType,
                "concurrentInstances":productArray[i].concurrentInstances,
                "counts":productArray[i].counts,
                "countCriteria":productArray[i].countCriteria,
                "remotedesktop":productArray[i].remotedesktop,
                "network":productArray[i].network,
                "virtualMachine":productArray[i].vm
            }
        }

        //TableData = $.toJSON(TableData);

        /*var TableData = new Array();

        $('#productTable tr').each(function(row, tr){
            TableData[row]={
                "featureID" : $(tr).find('td:eq(0)').text()
                , "featureName" :$(tr).find('td:eq(1)').text()
                , "featureDescription" : $(tr).find('td:eq(2)').text()
                , "licenseType" : $(tr).find('td:eq(3)').text()
                , "concurrentInstances" : $(tr).find('td:eq(4)').text()
                , "unlimitedConcurrency" : $(tr).find('td:eq(5)').text()
                , "countInstanceAs" : $(tr).find('td:eq(6)').text()
                , "remoteDesktop" : $(tr).find('td:eq(7)').text()
                , "network" : $(tr).find('td:eq(8)').text()
                , "virtualMachine" : $(tr).find('td:eq(9)').text()

            }
        });
        TableData.shift();  // first row will be empty - so remove
        */
        var data={
            productID:productId,
            productName:productName,
            productDescription:productDescription,
            productLockingType:productLocking,
            features:emp
        };

        var jsonobj=JSON.stringify(data);
        console.log(jsonobj);
       $http.post('/Product',jsonobj).success(function(err,response)
       {
           console.log(response);
           productRefresh();

        });
        productRefresh();
        $scope.productArray={};
        $scope.product={};
    }

}
]);