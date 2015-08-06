
var app=angular.module('license1',[]);

// view directive for memory
app.directive('view', function() {
    return {
        transclude: false,
        replace: false,
        restrict: 'C',
        link: function($scope, element) {
            element.bind('keypress', function(ev) {
                console.log('press');
                var d = 0;
                switch (ev.which) {
                    case 37: d = -1;
                    case 38: d = -$scope.rows;
                    case 39: d = 1;
                    case 40: d = $scope.rows;
                }
                $scope.current += d;
            });
        }
    };
});
app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function(){
                scope.$apply(function(){
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
app.service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function(file, uploadUrl){
        var fd = new FormData();

        fd.append('file', file);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
            .success(function(){
                alert("File uploaded");
            })
            .error(function(){
                alert("Error to Uploading File");
            });
    }
}]);

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

app.controller('licenseController1',['$scope','fileUpload','$http',function($scope,fileUpload,$http)
{
    $scope.toggle2 = true;
    $scope.toggle3 = true;
    $scope.prdcthide = true;
    $scope.featurehide = true;
    //file upload function
    $scope.uploadFile = function() {

        var file = $scope.myFile;
        var uploadUrl = "/api/photo";
        var fd = new FormData();

        fd.append('file', file);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
            .success(function(){

                currentstate();
            })
            .error(function(){
                $scope.result = 'Error to Uploading File.';
                $('#alert1').modal('show');
            });
        //fileUpload.uploadFileToUrl(file, uploadUrl);
        $scope.toggle3 = false;

    };

    //get the c2v XML
    var currentstate = function(){

        $http.post('/c2v_xml').success(function(response)
            {
                if(response.sentinel_ldk_info.key.type == 'Sentinel-HL-Time')
                {
                    $scope.result = 'Can not be decode HL Type C2V.';
                    $('#alert1').modal('show');
                }
                else {
                    $scope.data1 = [response];
                    $scope.toggle2 = false;
                }
            }
        ).error(function(data, status, headers, config) {
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

    $scope.func1=function(m2){
        $scope.featurehide = true;
        $scope.prdcthide = false;
        $scope.val="true";
        $scope.productdisplay = m2;
        $scope.featuredisplay=m2.feature;
    }
    //for display feature
    $scope.func2=function(m11)
    {
        $scope.prdcthide = true;
        $scope.featurehide = false;
        $scope.featuredetails=m11;

    }

    // code for memory view
    var newMemArray=[];
    $scope.rows = 30;
    $scope.cols = 10;
    $scope.items = [];
    $scope.positions = [];

    //convertions binary to hexadecimal code
    $scope.toHex = function (number, length) {
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

    $scope.newMem=function(d){

       //load text and converts into binary form
        jBinary.loadData(File, function(err, data) {
            $scope.binary = new jBinary(Base64.decode(d.ro_memory.$t));
            $scope.offset = $scope.current = 0;
            $scope.loadItems();
        });
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
            $scope.positions.push( $scope.toHex($scope.offset + i*32, 8) );
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
            $scope.offset = $scope.rows * Math.floor( window.scrollY/20 );
            $scope.loadItems();
        }, 50);
    });
    //new memory show in table

    $scope.deleteMem = function(id){
        for(var i in newMemArray)
        {
            if(newMemArray[i].names == id){
                newMemArray.splice(i,1);
            }
        }
    };
}
]);


