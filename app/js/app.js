var app = angular.module('app', ['infinite-scroll', 'ui.grid', 'ui.grid.resizeColumns', 'ui.grid.infiniteScroll', 'ui.select', 'ngRoute', 'ngStorage']);
app.run(['$rootScope', '$http', '$location', '$localStorage',function($rootScope, $http, $location, $localStorage){
    // keep user logged in after page refresh
    if ($localStorage.loggedInUser) {
        $http.defaults.headers.common.Authorization = 'Bearer ' + $localStorage.loggedInUser.token;
    }

    // redirect to login page if not logged in and trying to access a restricted page
    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        var publicPages = ['/'];
        var restrictedPage = publicPages.indexOf($location.path()) === -1;
        if (restrictedPage && !$localStorage.loggedInUser) {

            $location.path('/');
        }
        else if (restrictedPage && $location.path() !== '/patientproviders') {

            $location.path('/');

        }
    });
}]);

/*function run($rootScope, $http, $location, $localStorage) {
    // keep user logged in after page refresh
    if ($localStorage.loggedInUser) {
        $http.defaults.headers.common.Authorization = 'Bearer ' + $localStorage.loggedInUser.token;
    }

    // redirect to login page if not logged in and trying to access a restricted page
    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        var publicPages = ['/'];
        var restrictedPage = publicPages.indexOf($location.path()) === -1;
        if (restrictedPage && !$localStorage.loggedInUser) {

            $location.path('/');
        }
        else if (restrictedPage && $location.path() !== '/patientproviders') {

            $location.path('/');

        }
    });
}*/