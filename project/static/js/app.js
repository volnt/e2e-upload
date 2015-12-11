var app = angular.module("app", ["ngFileUpload"]);

app.controller("BodyCtrl", function ($scope, Upload) {

    $scope.uploading = false;
    $scope.progress = 0;

    $scope.upload = function(file) {
        Upload.upload({
            url: '/upload/',
            data: {file: file}
        }).then(function (response) {
            $scope.uploading = false;
        }, function (response) {
            $scope.uploading = false;
        }, function (evt) {
            $scope.uploading = true;
            $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
        });
    };
});
