/**
 * Created by Komal on 20/05/15.
 */
var app = angular.module('newProduct', ['angularUtils.directives.dirPagination']);
var uidp = 1;
var newproduct1;

var Base64 = {
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    encode: function(e) {
        var t = "";
        var n, r, i, s, o, u, a;
        var f = 0;
        e = Base64._utf8_encode(e);
        while (f < e.length) {
            n = e.charCodeAt(f++);
            r = e.charCodeAt(f++);
            i = e.charCodeAt(f++);
            s = n >> 2;
            o = (n & 3) << 4 | r >> 4;
            u = (r & 15) << 2 | i >> 6;
            a = i & 63;
            if (isNaN(r)) {
                u = a = 64
            } else if (isNaN(i)) {
                a = 64
            }
            t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a)
        }
        return t
    },
    decode: function(e) {
        var t = "";
        var n, r, i;
        var s, o, u, a;
        var f = 0;
        e = e.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (f < e.length) {
            s = this._keyStr.indexOf(e.charAt(f++));
            o = this._keyStr.indexOf(e.charAt(f++));
            u = this._keyStr.indexOf(e.charAt(f++));
            a = this._keyStr.indexOf(e.charAt(f++));
            n = s << 2 | o >> 4;
            r = (o & 15) << 4 | u >> 2;
            i = (u & 3) << 6 | a;
            t = t + String.fromCharCode(n);
            if (u != 64) {
                t = t + String.fromCharCode(r)
            }
            if (a != 64) {
                t = t + String.fromCharCode(i)
            }
        }
        t = Base64._utf8_decode(t);
        return t
    },
    _utf8_encode: function(e) {
        e = e.replace(/\r\n/g, "\n");
        var t = "";
        for (var n = 0; n < e.length; n++) {
            var r = e.charCodeAt(n);
            if (r < 128) {
                t += String.fromCharCode(r)
            } else if (r > 127 && r < 2048) {
                t += String.fromCharCode(r >> 6 | 192);
                t += String.fromCharCode(r & 63 | 128)
            } else {
                t += String.fromCharCode(r >> 12 | 224);
                t += String.fromCharCode(r >> 6 & 63 | 128);
                t += String.fromCharCode(r & 63 | 128)
            }
        }
        return t
    },
    _utf8_decode: function(e) {
        var t = "";
        var n = 0;
        var r = c1 = c2 = 0;
        while (n < e.length) {
            r = e.charCodeAt(n);
            if (r < 128) {
                t += String.fromCharCode(r);
                n++
            } else if (r > 191 && r < 224) {
                c2 = e.charCodeAt(n + 1);
                t += String.fromCharCode((r & 31) << 6 | c2 & 63);
                n += 2
            } else {
                c2 = e.charCodeAt(n + 1);
                c3 = e.charCodeAt(n + 2);
                t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
                n += 3
            }
        }
        return t
    }
}

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

app.controller('NewProduct', [
    '$scope',
    '$http',
    function($scope, $http) {
        $scope.LicenseType_selects = [
            'perpetual',
            'Execution',
            'Expiration Date',
            'Time Period'
        ];
        $scope.name_licenseType = $scope.LicenseType_selects[0];
        $scope.toggle1 = true;
        $scope.name_licenceType = $scope.LicenseType_selects[0];
        $scope.LockingType_selects = [
            'HL',
            'SL-AdminMode',
            'SL-UserMode',
            'HL or SL-AdminMode',
            'HL or SL-AdminMode or SL-UserMode'
        ];

        var newMemArray = [];
        $scope.arrProv = [];
        $scope.rows = 30;
        $scope.cols = 10;
        $scope.items = [];
        $scope.positions = [];
        $scope.name_lockingType = $scope.LockingType_selects[0];
        $scope.productArray = [];
        // Refresh the Product Table
        var productRefresh = function() {
            $http.get('/getProduct').success(function(response) {
                $scope.productDB = response;
                check($scope.productDB);
            });
        };

        // Delete a Product
        $scope.removeProduct = function(id) {
            $http.delete('/getProduct/' + id).success(function(response) {
                productRefresh();
            });
        };
        // Gets the Features
        var refresh = function() {
            $http.get('/feature').success(function(response) {
                $scope.productFeature = response;
            });
        };
        refresh();

        var check = function(prdb) {
            $http.get('/showTemplate').success(function(response) {
                licArray = response;
                for( var i in prdb)
                {
                    var flag1 = false;
                    var tempt = prdb[i]._id;
                    for( var j in licArray) {
                        for(var k in licArray[j].product) {
                            //console.log(licArray[i].product[j]._id);
                            if(tempt === licArray[j].product[k]._id)
                            {
                                flag1=true;
                            }
                        }
                    }
                    if(flag1 === true) {
                        prdb[i].flag = "true";
                        $http.put('/updateProductStatus/'+prdb[i]._id,prdb[i]).success(function(response){
                             
                        });
                     }
                    else
                    {
                        prdb[i].flag = "false";
                        $http.put('/updateProductStatus/'+prdb[i]._id,prdb[i]).success(function(response){
                             
                        });
                    }
                }
            });
        };
        //productRefresh();
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
        $scope.reset = function(form) {
            if (form) {
                form.$setPristine();
                form.$setUntouched();
            }
        };

        $scope.newMem = function(mem,form) {

            if(mem.offsets !='' && mem.texts != '' && mem.lengths && mem.colors != '' && mem.Description != '' && mem.names != '' )
            {
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
                    $scope.toggle1 = false;
                    $scope.loadItems();
                });



                $scope.mem = {};
                $scope.mem.texts = 'Read-Only Memory';
                $scope.mem.offsets = 10;
                $scope.mem.lengths = 20;
                $scope.mem.colors = '#FFFFFF';
                //form.$setPristine();
                //form.$setUntouched();
                $('#newMem').modal('hide');
                form.$setPristine();
                form.$setUntouched();
                /*
                $scope.memoryForm.$setPristine();
                $scope.memoryForm.$setUntouched();
                $scope.mem.$setPristine();
                $scope.mem.$setUntouched();
*/
            }
            else{
                console.log("error");
            }
            $scope.reset(form);
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
        $scope.deleteMem = function(id) {
            for (var i in newMemArray) {
                if (newMemArray[i].names == id) {
                    newMemArray.splice(i, 1);
                }
            }
        };

        $scope.provisional = function(id) {
            $http.get('/getOneProduct/' + id).success(function(response) {
                $scope.provision = response;
                for (var i in $scope.provision[0].feature) {
                    $scope.arrProv.push($scope.provision[0].feature[i]);
                }
            });
        };

        // Add Features in Configurations
        $scope.configureFeature = function(feature) {
            $scope.name = feature;
        };

        //show features in the table of new product table
        $scope.featureDefine = function(name,form) {

            var flag = false;
            for (var i in $scope.productArray) {
                if ($scope.productArray[i]._id === name._id) {
                    flag = true;
                    $scope.result = 'Can not Add Duplicate Feature. Please Add Different Features !!';
                    $('#alert1').modal('show');
                }
            }
            if (flag == false)
                $scope.productArray.push(name);

            $scope.toggle = true;
            $scope.togle = false;
            $scope.name = {};
            $scope.licenseType = '';
            $scope.name_lockingType = $scope.LockingType_selects[0];
            $scope.name_licenseType = $scope.LicenseType_selects[0];
            $scope.mySwitch = false;
            $scope.name.counts = 'No';
            $scope.name.concurrentInstances = '';
            $('#modalId').modal('hide');
            form.$setPristine();
            form.$setUntouched();
        };

        $scope.editProv = function(featureId) {
            for (var i in $scope.arrProv) {
                if ($scope.arrProv[i].featureID === featureId) {
                    $scope.provFeats = angular.copy($scope.arrProv[i]);

                }
            }
        };

        $scope.delProv = function(featureID) {
          for (var i in $scope.arrProv) {
              if($scope.arrProv[i].featureID === featureID) {
                  $scope.arrProv.splice(i,1);
              }
          }
        };

        $scope.provFeatn = function(provFeats, form) {
            for (var i in $scope.arrProv) {
                if ($scope.arrProv[i].featureID == provFeats.featureID) {
                    // $scope.arrProv.splice(i, 1);
                    $scope.result = 'Feature Already Existing.\n Try Again with different Feature';
                    $('#alert1').modal('show');
                    return;
                }
            }
            $scope.arrProv.push(angular.copy(provFeats));

            $('#provFeat').modal('hide');
            $scope.provFeats = {};
            form.$setPristine();
            form.$setUntouched();
        };

        $scope.provFeatnEdit = function(provFeats){
            for(var i in $scope.arrProv) {
                if($scope.arrProv[i].featureID == provFeats.featureID) {
                    $scope.arrProv.splice(i, 1);
                }
            }
            $scope.arrProv.push(angular.copy(provFeats));
            $scope.provFeats = {};
        }

        $scope.provMoreFeature = function(feature) {
            $scope.provFeats = feature;
        };

        // edit the Product
        $scope.editProductFeature1 = function(id) {
            for (var i in $scope.productArray) {
                if ($scope.productArray[i].id == id) {
                    $scope.name = angular.copy($scope.productArray[i]);
                }
            }
        };

        $scope.editProduct = function(id) {
            $http.get('/oneProductE/' + id).success(function(response) {
                $scope.product1 = response;
            });
        };

        $scope.editFeature1 = function(id, featureid) {
            $http.get('/getEditFeature/' + id + '/' + featureid).success(function(data) {
                var featureArray = data.feature;
                for (var i = 0; i < featureArray.length; i++) {
                    if (featureArray[i].featureID == featureid) {
                        $scope.name2 = featureArray[i];
                    }
                }
            });
        };

        $scope.featureDefine1 = function(product2, name3) {
            product2 = angular.copy(product2);
            name3 = angular.copy(name3);
            newproduct1 = {
                product2: product2,
                name3: name3
            };
            $http.put('/updatefeature/' + product2._id + '/' + name3._id, newproduct1).success(function(response) {
                angular.copy(response);
                productRefresh();
            });
            $scope.editProduct(product2._id);
        };

        $scope.deleteProduct2 = function(product1, featureid) {

            $http.put('/deletefeature/' + product1 + '/' + featureid).success(function(response) {
                productRefresh();
            });
            $scope.editProduct(product1);
            productRefresh();
        };
        //delete a product

        $scope.cancelTrash = function(productID, cancelProduct)
        {
            $http.put('/cancelDel/'+productID+'/'+cancelProduct.id).success(function(response){
                
                productRefresh();
            });
            productRefresh();
        };

        $scope.modifyTrash = function(productID, cancelProduct)
        {
            $http.put('/modifyDel/'+productID+'/'+cancelProduct.id).success(function(response){
                
                productRefresh();
            });
            productRefresh();
        };

        $scope.provisionTrash = function(productID, provisionProduct)
        {
            $http.put('/provisionDel/'+productID+'/'+provisionProduct.id).success(function(response){
                console.log(response);
                productRefresh();
            });
            productRefresh();
        };


        $scope.deleteProduct = function(id) {
            for (var i in $scope.productArray) {
                if ($scope.productArray[i].id == id) {
                    $scope.productArray.splice(i, 1);
                    $scope.name = {};
                }
            }
        };

        $scope.updateproduct = function(product1) {
            $http.put('/oneProductU/' + product1._id, product1).success(function(response) {
                productRefresh();
            });
            product1 = {};
            $scope.product1 = {};
        };

        $scope.modifyArr = [];

        $scope.modification = function(id) {
            $http.get('/getOneProduct/' + id).success(function(response) {
                $scope.modifyAttr = response;

                for (var i in $scope.modifyAttr[0].feature) {
                    $scope.modifyArr.push($scope.modifyAttr[0].feature[i]);
                }
            });
        };

        $scope.cancelArr = [];
        $scope.cancellation = function(id) {
            $http.get('/getOneProduct/' + id).success(function(response) {
                $scope.cancelAttr = response;
                for (var i in $scope.cancelAttr[0].feature) {
                    $scope.cancelArr.push($scope.cancelAttr[0].feature[i])
                }
            });
        }

        $scope.addModifyFeature = function(modifyFeatureAttr ,form) {
            for (var i in $scope.modifyArr) {
                if ($scope.modifyArr[i].featureID === modifyFeatureAttr.featureID) {
                    $scope.result = 'Feature alredy Existing in Product.\n Try again with different Feature.';
                    $('#alert1').modal('show');
                    return;
                }
            }
            $scope.modifyArr.push(modifyFeatureAttr);
            $('#modiDefineFeature').modal('hide');
            $scope.modifyFeatureAttr = {};
            $scope.modifyFeature.$setPristine();
            $scope.modifyFeature.$setUntouched();
            form.$setPristine();
            form.$setUntouched();

        };

        $scope.addCancFeature = function(modifyFeatureAttr, form) {
            for (var i in $scope.cancelArr) {
                if ($scope.cancelArr[i].featureID === modifyFeatureAttr.featureID) {
                    $scope.result = 'Feature Already Existing in Product.\n Try again with different Feature.';
                    $('#alert1').modal('show');
                    return ;
                }
            }
            $scope.cancelArr.push(modifyFeatureAttr);
            $('#cancDefineFeature').modal('hide');
            $scope.modifyFeatureAttr = {};
            $scope.cancelFeatureFrom.$setPristine();
            $scope.cancelFeatureFrom.$setUntouched();
            form.$setPristine();
            form.$setUntouched();
            $scope.modifyFeatureAttr = {};
        };

        $scope.modifyFeatureFunc = function(modifyAttr) {
            for (var i in $scope.modifyArr) {
                if ($scope.modifyArr[i].featureID == modifyAttr.featureID) {
                    $scope.modifyArr.splice(i, 1);
                }
            }
            $scope.modifyArr.push(angular.copy(modifyAttr));
        };

        $scope.addOverwriteFeature = function(modifyAttr) {
            for (var i in $scope.modifyArr) {
                if ($scope.modifyArr[i].featureID == modifyAttr.featureID) {
                    $scope.modifyArr.splice(i, 1);
                }
            }
            $scope.modifyArr.push(angular.copy(modifyAttr));
        };

        $scope.moreModifyFeature = function(feature) {
            $scope.modifyFeatureAttr = feature
        };

        $scope.modifyActionFeature = function(attrs) {
            $scope.modifyFeatureAction = attrs;
        };

        $scope.overwriteAction = function(attrs) {
            $scope.overwriteAttrs = attrs;
        };

        $scope.addProvisionalProduct = function(product_id, productNam, productId, productLockingType, memoryType, memory, arrProv,form) {
            var provisional = {
                _id: product_id,
                id: productId,
                name: productNam,
                enforcement_type: productLockingType,
                memoryType: memoryType,
                memory: memory,
                feature: angular.copy(arrProv)
            };
            $http.put('/addProvisionalProduct', provisional).success(function(response) {
                
            })
            arrProv = [];
            $scope.provision = {};
            $scope.provision=[];
            $scope.pro_BaseProduct = '';

            $('#provisional').modal('hide');
            form.$setPristine();
            form.$setUntouched();
            productRefresh();

        };
        productRefresh();

        $scope.addModifyPrdct = function(modify_id, modifyproductid, modifyname, modifyproductLockingType, memoryType, memory ,modifyArr) {
            var modification = {
                _id: modify_id,
                id: modifyproductid,
                name: modifyname,
                enforcement_type: modifyproductLockingType,
                memoryType: memoryType,
                memory: memory,
                feature: angular.copy(modifyArr)
            };
            console.log(modification);
            $http.put('/addModifyProduct', modification).success(function(response) {
                
                productRefresh();
            })
            modifyArr = [];
            $('#modification').modal('hide');
            productRefresh();
        };

        $scope.addCancelPrdct = function(cancel_id, cancelProductId, cancelName, cancelProductLockingType, memoryType, memory, cancelProduct, cancelarr, form) {

            var cancel = {
                _id: cancel_id,
                id: cancelProductId,
                name: cancelName,
                enforcement_type: cancelProductLockingType,
                memoryType:memoryType,
                memory:memory,
                cancelProduct:cancelProduct,
                feature: angular.copy(cancelarr)
            };

            $http.put('/addCancelProduct', cancel).success(function(respose) {
                
                productRefresh();
            });
            $('#cancellation').modal('hide');
            $scope.modifyFeatureAttr = {};
            $scope.cancelForm.$setPristine();
            $scope.cancelForm.$setUntouched();
            form.$setPristine();
            form.$setUntouched();
            $scope.cancelarr=[];
            productRefresh();
        };

        //refreshing the main product table
        $scope.forRefresh = function() {
            productRefresh();
        };

        // show the details of an product
        $scope.showDetails = function(id) {
            $scope.demoarr = [];
            $http.get('/oneProduct/' + id).success(function(response) {
                $scope.members = response;
                $scope.demoarr.push($scope.members);
            });
        };

        $scope.cancelFeature = function(feature, product) {
            $http.put('/cancelFeature/'+feature._id+'/'+product._id).success(function(response) {
            });

        };

        // save the complete product in mongodb
        $scope.addProduct = function(product, productArray, newMemDisplay, memtype,form) {
            var memory = [];

            var clone_protection_ex = {
                physical_machine: product.physical_machine,
                virtual_machine: product.virtual_machine
            }
            for (var i in newMemDisplay) {
                memory[i] = {
                    "offset": newMemDisplay[i].offsets,
                    "content": Base64.encode(newMemDisplay[i].texts)
                }
            }
            var data = {
                productID: product.productID,
                productName: product.productName,
                productDescription: product.productDescription,
                flag: product.flag,
                productLockingType: product.productLockingType,
                use_vclock: product.use_vclock,
                clone_protection_ex: clone_protection_ex,
                memoryType: memtype,
                memory: angular.copy(memory),
                feature: angular.copy(productArray)
            };
            var jsonobj = JSON.stringify(data);
            $http.post('/Product', jsonobj).success(function(response) {
                productRefresh();
            });

            productRefresh();
            $scope.productArray = [];
            $scope.memory = [];
            memory = [];
            newMemArray= [];
            $scope.toggle = false;
            $scope.togle = true;
            $scope.toggle1 = true;
            $scope.newMemArray = [];
            $scope.product = {};
            clone_protection_ex = {};
            data = {};
            $scope.name_lockingType = $scope.LockingType_selects[0];
            $scope.newMemDisplay = [];
            $scope.newMemDisplay = {};
            $scope.newMemDisplay = '';
            $scope.items = [];
            $scope.name.concurrentInstances = '';
            $scope.licenseType = '';
            $scope.mySwitch = false;
            $scope.positions = [];
            $('#myModal').modal('hide');
            form.$setPristine();
            form.$setUntouched();

        };

        $scope.closeTerms = function(name,form) {
            angular.copy(name);
            $scope.name = {};
            $scope.licenseType = '';
            $scope.name_lockingType = $scope.LockingType_selects[0];
            $scope.mySwitch = false;
            $scope.name.counts = 'No';
            $scope.name.concurrentInstances = '';
            $('#modalId').modal('hide');
            form.$setPristine();
            form.$setUntouched();
        };

        $scope.closeProduct = function(product, productArray,form) {
            angular.copy(product, productArray);
            $scope.product = {};
            $scope.name = {};
            $scope.name.concurrentInstances = '';
            $scope.licenseType = '';
            $scope.mySwitch = false;
            $scope.name_lockingType = $scope.LockingType_selects[0];
            $scope.toggle = false;
            $scope.togle = true;
            $scope.toggle1 = true;
            newMemArray = [];
            $scope.newMemDisplay = [];
            $scope.productArray = [];
            $('#myModal').modal('hide');
            form.$setPristine();
            form.$setUntouched();
        };

        $scope.closeBtn = function(form) {
            $scope.arrProv = [];
            $scope.modifyArr = [];
            $scope.cancelArr = [];
            $('#provisional').modal('hide');
            form.$setPristine();
            form.$setUntouched();
        };
    }
]);