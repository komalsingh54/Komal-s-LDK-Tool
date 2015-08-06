/**
 * Created by KSingh1 on 6/2/2015.
 */
var app = angular.module('license', ['angularUtils.directives.dirPagination']);
var productSelect = [];
var newMemArray = [];


app.directive('fileModel', ['$parse', function($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function() {
                scope.$apply(function() {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);
app.directive('hboTabs', function() {
    return {
        restrict: 'A',
        link: function(scope, elm, attrs) {
            var jqueryElm = $(elm[0]);
            $(jqueryElm).tabs()
        }
    };
});

app.service('fileUpload', ['$http', function($http) {
    this.uploadFileToUrl = function(file, uploadUrl) {
        var fd = new FormData();
        fd.append('file', file);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined
            }
        })
            .success(function() {
                alert("File Uploaded");
            })
            .error(function() {});
    }
}]);

app.directive('view', function() {
    return {
        transclude: false,
        replace: false,
        restrict: 'C',
        link: function($scope, element) {
            element.bind('keypress', function(ev) {

                var d = 0;
                switch (ev.which) {
                    case 37:
                        d = -1;
                    case 38:
                        d = -$scope.rows;
                    case 39:
                        d = 1;
                    case 40:
                        d = $scope.rows;
                }
                $scope.current += d;
            });
        }
    };
});

app.controller('licenseController', ['$scope', 'fileUpload', '$http', function($scope, fileUpload, $http) {
    $scope.rows = 30;
    $scope.cols = 10;
    $scope.items = [];
    $scope.positions = [];
    $scope.toggle = true;
    $scope.toggle1 = true;

    // display existing products in popup select product button
    var productRefresh = function() {
        $http.get('/getProduct').success(function(response) {
            $scope.productDB = response;
        });
    };
    productRefresh();

    $scope.find = function(lock) {

    };

    var showTemplate = function() {
        $http.get('/showTemplate').success(function(response) {
            $scope.licArray = response;
        });
    };
    showTemplate();

    // displays all selected products in table
    $scope.select = function(prdcts, selecting) {
        console.log(angular.copy(prdcts));

        if (selecting === true) {

            var flagc = false;

            for (var i in productSelect) {

                if (productSelect[i]._id === prdcts._id) {
                    flagc = true;
                    $scope.result = 'Unable to Add Duplicate Product. Please Add Different Product !!';
                    $('#alert1').modal('show');

                }
            }

            if(!flagc) {
                if (prdcts.id) {
                    prdcts = {
                        productID: prdcts.id,
                        productName: prdcts.name,
                        productDescription: prdcts.productDescription,
                        flag: prdcts.flag,
                        productLockingType: prdcts.enforcement_type,
                        cancelProduct: prdcts.cancelProduct,
                        use_vclock: prdcts.use_vclock,
                        clone_protection_ex: prdcts.clone_protection_ex,
                        memoryType: prdcts.memoryType,
                        memory: prdcts.memory,
                        feature: angular.copy(prdcts.feature)
                    };
                    productSelect.push(prdcts);
                    $scope.prdctDisplay = productSelect;
                }
                else {
                    productSelect.push(prdcts);
                    $scope.prdctDisplay = productSelect;
                }
                $scope.toggle = false;
            }
            else{}
        }
        else {
            for (var i in productSelect) {
                if (productSelect[i].productID === prdcts.productID)
                    productSelect.splice(i, 1);
            }
        }
    };

    //convertions binary to hexadecimal code
    $scope.toHex = function(number, length) {
        var s = number.toString(16).toUpperCase();
        while (s.length < length) {
            s = '0' + s;
        }
        return s;
    };

    //conversion from binary to character
    $scope.toChar = function(number) {
        return number <= 32 ? ' ' : String.fromCharCode(number);
    };

    //pushing new memory in array
    $scope.newMem = function(mem) {
        newMemArray.push(mem);
        $scope.newMemDisplay = newMemArray;
        var offs = mem.offsets;
        var ins = mem.texts;

        //load text and converts into binary form
        jBinary.loadData(File, function(err, data) {

            var arr = [];
            for (var i = 0; i < offs; i++)
                arr.push('\0');
            var tmps = arr + ins;
            $scope.binary = new jBinary(tmps);
            document.querySelector('.view').style.background = mem.colors;
            //document.querySelector('.tmp').style.height = $scope.binary.view.byteLength/$scope.rows*20 + 250 + 'px';
            $scope.offset = $scope.current = 0;
            $scope.loadItems();
        });

        $scope.mem = {};
        $scope.toggle1 = false;

    };

    $scope.loadItems = function() {
        var data = $scope.binary.read(['blob', Math.min($scope.rows * $scope.cols - 1, $scope.binary.view.byteLength - $scope.offset)], $scope.offset);
        $scope.items = [];
        $scope.positions = [];
        for (var i in data) {
            if (typeof data[i] !== 'object' && typeof data[i] !== 'function')
                $scope.items.push(data[i]);
        }
        var j;
        while ((j = $scope.items.indexOf(44)) != -1) {
            $scope.items.splice(j, 1);
            i++;
        }

        for (i = 0; i < $scope.cols; i += 1) {
            $scope.positions.push($scope.toHex($scope.offset + i * 32, 8));
        }
        // $scope.$apply();
    };

    //set current index
    $scope.setCurrent = function(index) {
        $scope.current = index;
    };

    var timeout = null;
    angular.element(window).bind('scroll', function() {
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            $scope.offset = $scope.rows * Math.floor(window.scrollY / 20);
            $scope.loadItems();
        }, 50);
    });
    //new memory show in table

    //delete memory from the array
    $scope.deleteMem = function(id) {
        for (var i in newMemArray) {
            if (newMemArray[i].names == id) {
                newMemArray.splice(i, 1);
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

    $scope.viewLice = function(lic) {
        $scope.viewLic = lic;
    };

    var currentTime = new Date();
    var month = currentTime.getMonth() + 1;
    var day = currentTime.getDate();
    var year = currentTime.getFullYear();
    var dat = (year + "-" + month + "-" + day);

    $scope.draftLic = function (license, prdctDisplay,form) {

        if (license.rehost) {
            var licenses = {
                license_name: license.license_name,
                description: license.description,
                readable_license: license.readable_license,
                acknowledgement_request: license.acknowledgement_request,
                enforcement_type: license.enforcement_type,
                rehost: [{
                    type: 'EndUserManaged'
                }],
                enable_sl_legacy_support: license.enable_sl_legacy_support,
                upgrade_to_driverless: license.upgrade_to_driverless,
                product: angular.copy(prdctDisplay),
                date: dat,
                status: 'Draft'
            };
        } else {
            var licenses = {
                license_name: license.license_name,
                description: license.description,
                readable_license: license.readable_license,
                acknowledgement_request: license.acknowledgement_request,
                enforcement_type: license.enforcement_type,
                upgrade_to_driverless: license.upgrade_to_driverless,
                enable_sl_legacy_support: license.enable_sl_legacy_support,
                product: angular.copy(prdctDisplay),
                date: dat,
                status: 'Draft'
            };
        }
        $http.post('/draftLicense1', licenses).success(function(response) {

        });

        $scope.license = {};
        $scope.prdctDisplay = [];
        $('#licDef').modal('hide');
        form.$setPristine();
        form.$setUntouched();
        showTemplate();
    };

    $scope.produceLic = function(license, prdctDisplay, form) {
        console.log(JSON.stringify(prdctDisplay));
        if (license.rehost) {
            var licenses = {
                license_name: license.license_name,
                description: license.description,
                readable_license: license.readable_license,
                acknowledgement_request: license.acknowledgement_request,
                enforcement_type: license.enforcement_type,
                rehost: [{
                    type: 'EndUserManaged'
                }],
                enable_sl_legacy_support: license.enable_sl_legacy_support,
                upgrade_to_driverless: license.upgrade_to_driverless,
                product: angular.copy(prdctDisplay),
                date: dat,
                status: 'Generated'
            };
        } else {
            var licenses = {
                license_name: license.license_name,
                description: license.description,
                readable_license: license.readable_license,
                acknowledgement_request: license.acknowledgement_request,
                enforcement_type: license.enforcement_type,
                upgrade_to_driverless: license.upgrade_to_driverless,
                enable_sl_legacy_support: license.enable_sl_legacy_support,
                product: angular.copy(prdctDisplay),
                date: dat,
                status: 'Generated'
            };
        }
        $http.post('/produceLicense1', licenses).success(function(response) {

        });

        $scope.license = {};
        $scope.prdctDisplay = [];
        $('#licDef').modal('hide');
        $('#getFile').modal('show');
        form.$setPristine();
        form.$setUntouched();
        showTemplate();
    };

    $scope.generate_key = function () {
        $http.post('/generate_key').success(function(data, status, headers, config) {

            var anchor = angular.element('<a/>');
            anchor.css({display: 'none'}); // Make sure it's not visible
            angular.element(document.body).append(anchor); // Attach to document

            anchor.attr({
                href: 'data:attachment/txt;charset=utf-8,' + encodeURI(data),
                target: '_blank',
                download: 'license.v2c'
            })[0].click();

            anchor.remove(); // Clean it up afterwards
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
    };

    $scope.generateDraftKey = function(draftLic)
    {
        var filename = draftLic.license_name;

        $http.post('/generateDraftKey',angular.copy(draftLic)).success(function(data, status, headers, config) {
           var anchor = angular.element('<a/>');
            anchor.css({display: 'none'});
            angular.element(document.body).append(anchor);
            anchor.attr({
                href: 'data:attachment/txt;charset=utf-8,' +encodeURI(data),
                target: '_blank',
                download: filename+'.v2c'
            })[0].click();
            anchor.remove();
        }).error(function(data, status, headers, config){
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
        draftLic={};

        showTemplate();
    };

    //XML schema for provisional product
    var forProvisional = function(newMemDisplay, prdctDisplay, memType, license_type) {
        var product = [];
        var feature = [];
        var license_type = license_type;
        var temp = [];
        for (var i in newMemDisplay) {
            temp[i] = {
                "offset": newMemDisplay[i].offsets,
                "content": Base64.encode(newMemDisplay[i].texts)
            }
        }

        for (var i in prdctDisplay) {
            for (var j in prdctDisplay[i].feature) {
                if (prdctDisplay[i].feature[j].perpetual === 'perpetual') {
                    var license_properties = {};
                    license_properties['perpetual'] = null;
                    license_properties['remote_desktop_access'] = prdctDisplay[i].feature[j].remotedesktop;
                    license_properties['virtual_machine_access'] = prdctDisplay[i].feature[j].vm;
                }
                if (prdctDisplay[i].feature[j].execution_count === 'execution_count') {
                    var license_properties = {};
                    license_properties['execution_count'] = prdctDisplay[i].feature[j].execution_count;
                    license_properties['remote_desktop_access'] = prdctDisplay[i].feature[j].remotedesktop;
                    license_properties['virtual_machine_access'] = prdctDisplay[i].feature[j].vm;
                }

                if (prdctDisplay[i].feature[j].days_to_expiration === 'days_to_expiration') {
                    var license_properties = {};
                    license_properties['days_to_expiration'] = prdctDisplay[i].feature[j].days_to_expiration;
                    license_properties['remote_desktop_access'] = prdctDisplay[i].feature[j].remotedesktop;
                    license_properties['virtual_machine_access'] = prdctDisplay[i].feature[j].vm;
                }
                feature[j] = {
                    "id": prdctDisplay[i].feature[j].featureID,
                    "name": prdctDisplay[i].feature[j].featureName,
                    "license_properties": license_properties
                }
            }
        }

        for (var i in prdctDisplay) {

            product[i] = {
                "id": prdctDisplay[i].productID,
                "name": prdctDisplay[i].productName,
                "feature": feature[i]
            };
        }

        var memory = {};
        memory[memType] = temp;
        var licdata = {
            "enforcement_type": prdctDisplay[0].productLockingType,
            "product": product,
            "memory": memory
        };

        $http.post('/LicDefine', licdata).success(function(response) {
            $scope.result = 'License has been defined.';
            $('#alert1').modal('show');

        });

    };

    //insert all product and memory data to DB
    $scope.defineLic = function(newMemDisplay, prdctDisplay, memType, license_type) {
        var flag = true;
        if (license_type = "4") {
            for (var i in prdctDisplay) {
                if (prdctDisplay[i].productLockingType === "HL") {
                    $scope.result = 'Provisional License can not be apply in HL.';
                    $('#alert1').modal('show');

                    flag = false;

                } else
                    flag = true;
            }
            if (flag === true)
                forProvisional(newMemDisplay, prdctDisplay, memType, license_type);
        }
    };

    $scope.reset = function(license, prdctDisplay, form) {
        license = {}
        prdctDisplay = [];
        $scope.license = {};
        $scope.prdctDisplay = [];
        form.$setPristine();
        form.$setUntouched();
    }

    //file upload function
    $scope.uploadFile = function() {
        var file = $scope.myFile;
        //console.log('file is ' + JSON.stringify(file));
        var uploadUrl = "/api/photo";
        fileUpload.uploadFileToUrl(file, uploadUrl);
    };

    $scope.viewCompatibleDevice = function() {
        $http.post('/compatibleDevice').success(function(response) {
            $scope.resultant = JSON.stringify(response.sentinel_ldk_info.capable_devices.key_type.configuration);

        }).error(function(data, status, headers, config){
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
    };

    //generates the license
    $scope.generate_Lic = function() {
        $http.post('/generate_lic').success(function(response) {
            $scope.visible = true;

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
        });;
    };

}]);