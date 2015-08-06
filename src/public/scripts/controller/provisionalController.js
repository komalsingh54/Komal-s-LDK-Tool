/**
 * Created by Komal on 12/07/15.
 */

var app = angular.module('provisionalLicense', ['angularUtils.directives.dirPagination']);


app.controller('provisionalController', ['$scope', '$http', function($scope, $http) {

    var productSelect = [];
    $scope.toggle = true;

    // display existing products in popup select product button
    var productRefresh = function() {
        $http.get('/getProvisionalProduct').success(function(response) {
            $scope.productDB = response;

        });
    };
    productRefresh();

    var showTemplate = function() {
        $http.get('/showProvisionTemplate').success(function(response) {
            $scope.licArray = response;

        });
    };
    showTemplate();

    $scope.delTemplate = function (id) {
        $http.delete('/delTemplate/'+id).success(function(response) {

            showTemplate();
        })
    }

    // displays all selected products in table
    $scope.select = function(prdcts, selecting) {
        if (selecting === true) {
            productSelect.push(prdcts);
            $scope.prdctDisplay = productSelect;
            $scope.toggle = false;
        } else {
            for (var i in productSelect) {
                if (productSelect[i].productID === prdcts.productID)
                    productSelect.splice(i, 1);
            }
        }
    };


    $scope.removeTemplate = function(id) {
        $http.delete('/deleteTemplate/' + id).success(function(response) {
            showTemplate();
        });
    };

    //remove selecte product from the table
    $scope.removeSelectedProduct = function(id) {
        for (var i in productSelect) {
            if (productSelect[i].productID == id) {
                productSelect.splice(i, 1);
            }
        }
    };

    var currentTime = new Date();
    var month = currentTime.getMonth() + 1;
    var day = currentTime.getDate();
    var year = currentTime.getFullYear();
    var dat = (year + "-" + month + "-" + day);

    $scope.draftLic = function (license, productDisplay,form) {
        var licenses = {
            license_name: license.license_name,
            description: license.description,
            readable_license: license.readable_license,
            enforcement_type: license.enforcement_type,
            product: angular.copy(productDisplay),
            date: dat,
            status: 'Draft'
        };
        $http.post('/draftProvisionalLicense1', licenses).success(function(response) {

        });

        $scope.license = {};
        $scope.prdctDisplay = [];
        $scope.toggle = true;
        $('#licDef').modal('hide');
        form.$setPristine();
        form.$setUntouched();
        showTemplate();
    };

    $scope.produceProvisionalLic = function(license, prdctDisplay,form) {

            var licenses = {
                license_name: license.license_name,
                description: license.description,
                readable_license: license.readable_license,
                enforcement_type: license.enforcement_type,
                product: angular.copy(prdctDisplay),
                date: dat,
                status: 'Generated'
            };

        $http.post('/produceProvisionalLicense1', licenses).success(function(data, status, headers, config) {
                var anchor = angular.element('<a/>');
            anchor.css({display: 'none'});
            angular.element(document.body).append(anchor);
                anchor.attr({
                    href: 'data:attachment/txt;charset=utf-8,' + encodeURI(data),
                    target: '_blank',
                    download:  licenses.license_name+'.v2c'
                })[0].click();
            anchor.remove();

            }).error(function(data, status, headers, config) {
            switch(data){
                case 0:
                    $scope.result = 'Request successfully completed.';
                    $('#alert1').modal('show');
                    break ;
                case 5001:
                    $scope.result = 'Library initialization failed.';
                    $('#alert1').modal('show');
                    break;
                case 5002:
                    $scope.result = 'Failure in locking a resource.';
                    $('#alert1').modal('show');
                    break;
                case 5003:
                    $scope.result = 'System is out of memory.';
                    $('#alert1').modal('show');
                    break ;
                case 5004:
                    $scope.result = 'Invalid function parameter.';
                    $('#alert1').modal('show');
                    break ;
                case 5005:
                    $scope.alert = 'Invalid handle passed to the function.';
                    $('#alert1').modal('show');
                    break ;
                case 5006:
                    $scope.alert = 'More than 512 open handles exist.';
                    $('#alert1').modal('show');
                    break ;
                case 5007:
                    $scope.alert = 'The API function was not called in a valid sequence.';
                    $('#alert1').modal('show');
                    break ;
                case 5008:
                    $scope.result = 'An invalid Vendor Code was passed.';
                    $('#alert1').modal('show');
                    break ;
                case 5009:
                    $scope.result = 'An invalid license definition was passed.';
                    $('#alert1').modal('show');
                    break ;
                case 5010:
                    $scope.result = 'The current state in sntl_lg_start function was not correct.';
                    $('#alert1').modal('show');
                    break ;
                case 5011:
                    $scope.result = 'Invalid schema version.' ;
                    $('#alert1').modal('show');
                    break ;
                case 5012:
                    $scope.result = 'An internal error has occurred.';
                    $('#alert1').modal('show');
                    break ;
                case 5013:
                    $scope.result = 'Key is full.';
                    $('#alert1').modal('show');
                    break ;
                case 5014:
                    $scope.result = 'Key type is not supported.';
                    $('#alert1').modal('show');
                    break ;
                case 5015:
                    $scope.result = 'HL Basic key cannot be programmed.';
                    $('#alert1').modal('show');
                    break ;
                default:
                    $scope.result = 'Invalid';
                    $('#alert1').modal('show');
                    break;
            }
            });

        $scope.license = {};
        $scope.prdctDisplay = [];
        $scope.toggle = true;
        $('#licDef').modal('hide');
        form.$setPristine();
        form.$setUntouched();
        showTemplate();
    };

    $scope.draftKey = function (lic) {
        var fileName = lic.license_name;
        $http.post('/produceProvisionalLicense2', lic).success(function(data, status, headers, config) {
            var anchor = angular.element('<a/>');
            anchor.css({display: 'none'});
            angular.element(document.body).append(anchor);
            anchor.attr({
                href: 'data:attachment/txt;charset=utf-8,' + encodeURI(data),
                target: '_blank',
                download: fileName+'.v2c'
            })[0].click();
            anchor.remove();

        }).error(function(data, status, headers, config) {
            switch(data){
                case 0:
                    $scope.result = 'Request successfully completed.';
                    $('#alert1').modal('show');
                    break ;
                case 5001:
                    $scope.result = 'Library initialization failed.';
                    $('#alert1').modal('show');
                    break;
                case 5002:
                    $scope.result = 'Failure in locking a resource.';
                    $('#alert1').modal('show');
                    break;
                case 5003:
                    $scope.result = 'System is out of memory.';
                    $('#alert1').modal('show');
                    break ;
                case 5004:
                    $scope.result = 'Invalid function parameter.';
                    $('#alert1').modal('show');
                    break ;
                case 5005:
                    $scope.alert = 'Invalid handle passed to the function.';
                    $('#alert1').modal('show');
                    break ;
                case 5006:
                    $scope.alert = 'More than 512 open handles exist.';
                    $('#alert1').modal('show');
                    break ;
                case 5007:
                    $scope.alert = 'The API function was not called in a valid sequence.';
                    $('#alert1').modal('show');
                    break ;
                case 5008:
                    $scope.result = 'An invalid Vendor Code was passed.';
                    $('#alert1').modal('show');
                    break ;
                case 5009:
                    $scope.result = 'An invalid license definition was passed.';
                    $('#alert1').modal('show');
                    break ;
                case 5010:
                    $scope.result = 'The current state in sntl_lg_start function was not correct.';
                    $('#alert1').modal('show');
                    break ;
                case 5011:
                    $scope.result = 'Invalid schema version.' ;
                    $('#alert1').modal('show');
                    break ;
                case 5012:
                    $scope.result = 'An internal error has occurred.';
                    $('#alert1').modal('show');
                    break ;
                case 5013:
                    $scope.result = 'Key is full.';
                    $('#alert1').modal('show');
                    break ;
                case 5014:
                    $scope.result = 'Key type is not supported.';
                    $('#alert1').modal('show');
                    break ;
                case 5015:
                    $scope.result = 'HL Basic key cannot be programmed.';
                    $('#alert1').modal('show');
                    break ;
                default:
                    $scope.result = 'Invalid';
                    $('#alert1').modal('show');
                    break;
            }
        });
        lic = {};
    };

    $scope.reset = function(license, prdctDisplay, form) {

        $scope.license = {};
        $scope.prdctDisplay = [];
        $scope.toggle = true;
        $scope.provisionalForm = {};
        $('#licDef').modal('hide');
        form.$setPristine();
        form.$setUntouched();

    };



}]);