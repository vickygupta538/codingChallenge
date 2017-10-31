app.controller('authenticationCtrl',['$scope','$location','patientProviderService','authenticationService',
 function ($scope, $location, patientProviderService, authenticationService) {
	var vm = this;
	vm.user={
		username:'',
		password:''
	}

	//vm.register = false;
	vm.login = login;
	vm.isRegister=false;
	vm.register = register;
	initController();

	function initController() {
		// reset login status
		authenticationService.Logout();
	};
	//Login Function
	function login() {
		vm.loading = true;
		authenticationService.Login(vm.user, function (result) {
			if (result.success) {
				$location.path('/patientproviders');
			} else {
				vm.error = result.message;
				vm.loading = false;
			}
		});
	};
//Register Function
	function register() {
		vm.loading = true;
		authenticationService.Register(vm.user, function (result) {
			if (result.success) {
				vm.error = result.message;
				//$location.path('/');
				vm.isRegister=false;
				vm.loading = false;
			} else {
				vm.error = result.message;
				vm.loading = false;
			}
		});
	}
}]);