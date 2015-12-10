var app = angular.module("app", ["ngCookies"]);

app.controller("BodyCtrl", function ($scope, User, $cookies) {

    function main() {
        console.log("In the main function.")
    };

    main();
});
