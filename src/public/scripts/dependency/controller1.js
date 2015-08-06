

app.controller('main', ['$scope', function($scope)
{
   $scope.rows = 15;   //32
    $scope.cols = 8;//Math.floor( window.innerHeight/20 - 2 );  //20

    $scope.items = [];
    $scope.positions = [];

    $scope.toHex = function (number, length) {
        var s = number.toString(16).toUpperCase();
        while (s.length < length) {
            s = '0' + s;
        }
        return s;
    };

    $scope.toChar = function(number) {
        return number <= 32 ? ' ' : String.fromCharCode(number);
    };

    $scope.loadFromFile = function(ins,offsets) {
        jBinary.loadData(File, function(err, data) {
            
            var arr=[];
            for(var i=0;i<offsets;i++)
                arr.push('\0');
            var tmps=arr+ins;
            $scope.binary = new jBinary(tmps);
           document.querySelector('.tmp').style.height = $scope.binary.view.byteLength/$scope.rows*20 + 250 + 'px';
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
        console.log($scope.items);
        for (i = 0; i < $scope.cols; i += 1) {
            $scope.positions.push( $scope.toHex($scope.offset + i*32, 8) );
        }
        console.log($scope.positions);
        
       // $scope.$apply();
    };

    $scope.setCurrent = function(index) {
        $scope.current = index;
    };

    var timeout = null;
    angular.element(window).bind('scroll', function() {
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            $scope.offset = $scope.rows * Math.floor( window.scrollY/20 );
            console.log($scope.offset);
            $scope.loadItems();
        }, 50);
    });
}]);