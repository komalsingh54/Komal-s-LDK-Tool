var app = angular.module('feature', ['angularUtils.directives.dirPagination']);
app.controller('myController', ['$scope', '$http', function($scope, $http) {

    var refresh = function() {

        $http.get('/feature').success(function(response) {
            $scope.feature = response;
        });
    }
    refresh();


    $http.get('/featuredisplay/').success(function(response) {
        $scope.features = response;
        featuredetails($scope.features);
        refresh();
    });
    var edited_features;
    var featuredetails = function(features) {
        $http.get('/deletedisable').success(function(response) {
            $scope.product = response;
            featureTable_reset(features, $scope.product);
        });
    };
    var featureTable_reset = function(features, product) {
        for (var i = 0; i < features.length; i++) {
            for (var j = 0; j < product.length; j++) {
                for (var k = 0; k < (product[j].feature.length); k++) {
                    if (features[i].featureID === product[j].feature[k].featureID) {
                        features[i].flag = "true";
                        $http.put('/update_feature_collection/' + features[i]._id, features[i]).success(function(response) {});
                    }
                }
            }
        }
        $scope.edited_features = features;
        refresh();
    }
    refresh();

    $scope.sort = function (keyname) {
        $scope.sortKey = keyname;
        $scope.reverse = !$scope.reverse;
    }

    $scope.add = function(featureAdds,form) {

        if(featureAdds.featureID != '' && featureAdds.featureName != '' && featureAdds.featureDescription != '')
        {
            var featureAdds = {
                featureID: featureAdds.featureID,
                featureName: featureAdds.featureName,
                featureDescription : featureAdds.featureDescription,
                flag:"false"
            }
            $http.post('/feature', featureAdds).success(function (response) {
            });
            $scope.featureAdd='';
            $scope.featureAdd=[];
            $scope.featureAdd={};
            $('#modalId').modal('hide');
            form.$setPristine();
            form.$setUntouched();
            refresh();
        }
        else
        {
            $scope.invalidFeatureID = true;
            $scope.invalidFeatureName = true;
        }
    };
    refresh();

    $scope.reset = function(form) {
        if (form) {
            form.$setPristine();
            form.$setUntouched();
        }
    };

    $scope.remove = function(id) {
        $http.delete('/feature/' + id).success(function(response) {
            refresh();
        });
    }

    $scope.edit = function(id) {
        $http.get('/feature/' + id).success(function(response) {
            $scope.featureAdd1 = response;
        });
    }

    $scope.update = function(featureAdd1) {
        $http.put('/feature/' + featureAdd1._id, featureAdd1).success(function(response) {
            refresh();
        });
    }
    var features;

}]);