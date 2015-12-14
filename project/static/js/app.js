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
            var uuid = generateUUID();

            fileData = CryptoJS.AES.encrypt(fileData, uuid).toString();
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
                $location.url('/?_id=' + response.data._id + '&key=' + uuid);

            }, function (response) {
                $scope.uploading = false;
            }, function (evt) {
                $scope.uploading = true;
                $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
            });
        }
        reader.readAsDataURL(file);
    };

    /*
     * Download and decrypt the file with the given id
     */
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


            try {
                $scope.file = CryptoJS.AES.decrypt(fileData, $location.search().key).toString(CryptoJS.enc.Utf8);
            } catch (err) {
                console.log("Error decoding the file.");
            }
        }).error(function (response) {});
    };

    $rootScope.$on('$locationChangeSuccess', function (event) {
        var _id = $location.search()._id;
        var raw = $location.search().raw;

        if (_id !== undefined) {
            $scope.download(_id);

            if (raw !== undefined) {
                $scope.raw = true;
            }
        }
    })
});

/**
 * Generate a random UUID
 */
function generateUUID()
{
    var d = new Date().getTime();

    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c)
    {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8))
            .toString(16);
    });

    return uuid.toLowerCase();
}
