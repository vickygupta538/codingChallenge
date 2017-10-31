app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

	$routeProvider// home page
		.when('/', {
			templateUrl: 'views/login.html',
			controller: 'authenticationCtrl',
			controllerAs: 'vm'
		})

		.when('/patientproviders', {
			templateUrl: 'views/patientprovider.html',
			controller: 'patientProviderCtrl',
			controllerAs: 'vm'
		});

	$locationProvider.html5Mode(true);

}]);