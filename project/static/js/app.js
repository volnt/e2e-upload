var app = angular.module("app", ["ngFileUpload"]);

app.controller("BodyCtrl", function ($scope, $location, $rootScope, $http, Upload) {

    $scope.uploading = false;
    $scope.progress = 0;

    $scope.upload = function(file) {
        Upload.upload({
            url: '/upload/',
            data: {file: file}
        }).then(function (response) {
            var _id = response.data._id;
            $scope.uploading = false;
            $location.url("/?_id=" + response.data._id)
        }, function (response) {
            $scope.uploading = false;
        }, function (evt) {
            $scope.uploading = true;
            $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
        });
    };


    $rootScope.$on('$locationChangeSuccess', function(event) {
        var _id = $location.search()._id;

        if (_id !== undefined) {
            $scope._id = _id;
        }
    })
});
