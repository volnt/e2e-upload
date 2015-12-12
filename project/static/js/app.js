var app = angular.module("app", ["ngFileUpload"]);

app.controller("BodyCtrl", function ($scope, $location, $rootScope, $http, Upload) {

    $scope.uploading = false;
    $scope.progress = 0;

    /*
     * Encrypt and upload selected file to the backend
     */
    $scope.upload = function (file) {
        if (!file) { return ; }

        var reader = new FileReader();

        reader.onload = function (fileData)
        {
            var fileData = reader.result;
            var encryptedFile;
            var byteArray = [];
            var binary;

            fileData = CryptoJS.AES.encrypt(fileData, "test").toString();
            binary = atob(fileData);

            for (var i = 0; i < binary.length; i++) {
                byteArray.push(binary.charCodeAt(i));
            }
            encryptedFile = new Blob([new Uint8Array(byteArray)], {type: 'application/octet-stream'});

            Upload.upload({
                url: '/upload/',
                data: {file: encryptedFile}
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
        }
        reader.readAsDataURL(file);
    };

    $scope.download = function (_id) {
        $http.get('/upload/' + _id, {responseType: "arraybuffer"}).success(function (response) {

            function _arrayBufferToBase64(buffer) {
                var binary = '';
                var bytes = new Uint8Array(buffer);
                var len = bytes.byteLength;

                for (var i = 0; i < len; i++) {
                    binary += String.fromCharCode(bytes[i]);
                }
                return window.btoa(binary);
            }
            var fileData = _arrayBufferToBase64(response);


            $scope.file = CryptoJS.AES.decrypt(fileData, "test").toString(CryptoJS.enc.Utf8);
        }).error(function (response) {});
    };


    $rootScope.$on('$locationChangeSuccess', function (event) {
        var _id = $location.search()._id;

        if (_id !== undefined) {
            $scope.download(_id);
        }
    })
});
