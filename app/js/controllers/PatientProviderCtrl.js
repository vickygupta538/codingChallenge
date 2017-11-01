app.controller('patientProviderCtrl', ['$scope', '$location', 'patientProviderService', 'authenticationService', '$timeout', '$window', '$localStorage',
	function ($scope, $location, patientProviderService, authenticationService, $timeout, $window, $localStorage) {

	var vm = this;
	vm.isFetchingData = false;
	vm.page = 0
	vm.filter = {
		minDischarges:'',
		maxDischarges:'',
		minAvgCoveredCharges:'',
		maxAvgCoveredCharges:'',
		minAvgMedicarePayments:'',
		maxAvgMedicarePayments:'',
		state:''
	};
	vm.showError=false;

	vm.dataPoints = [{ name: "DRGDefinition", value: "DRG Definition", width: '10%',headerCellClass: 'headerBlue'}, 
	{ name: "ProviderName", value: "Provider Name", width: '10%',headerCellClass: 'headerBlue'}, 
	{ name: "ProviderId", value: "Provider ID", width: '8%',headerCellClass: 'headerBlue' }, 
	{ name: "ProviderStreetAddress", value: "Provider Street Address", width: '8%',headerCellClass: 'headerBlue'},
	{ name: "ProviderCity", value: "Provider City", width: '8%',headerCellClass: 'headerBlue'}, 
	{ name: "ProviderState", value: "Provider State", width: '8%',headerCellClass: 'headerBlue'}, 
	{ name: "ProviderZipCode", value: "Provider Zip Code", width: '8%',headerCellClass: 'headerBlue'}, 
	{ name: "HospitalReferralRegionDescription", value: "Hospital Referral Region Description", width: '8%',headerCellClass: 'headerBlue'}, 
	{ name: "TotalDischarges", value: "Total Discharges", width: '8%',headerCellClass: 'headerBlue'},
	{ name: "AverageCoveredCharges", value: "Average Covered Charges", width: '8%',cellFilter: 'currency',headerCellClass: 'headerBlue' },
	{ name: "AverageTotalPayments", value: "Average Total Payments", width: '8%',cellFilter: 'currency',headerCellClass: 'headerBlue' }, 
	{ name: "AverageMedicarePayments", value: "Average Medicare Payments", width: '8%',cellFilter: 'currency',headerCellClass: 'headerBlue' }]

	vm.selectedDataPoints = [];
	vm.patientProviderData = [];
	vm.fetchData = fetchData;
	vm.getMoreData = getMoreData;
	vm.logout = logout;
	//vm.scroll = scroll;
	//vm.setDollar=setDollar;
	$scope.data = [];
	$scope.cols = [];
	vm.recordsCount = 0;
	vm.totalCount = 0;
	vm.firstTime = true;
	vm.loading = false;
	vm.onDataPointSelect=onDataPointSelect;
	vm.loggedinUser=$localStorage.loggedInUser.username;
	// Initial Code Run 
	fetchData(vm.firstTime, false);
	$scope.gridApi={};

	// Function to get selected datapoints
	function getDataPoints() {
		var setdatapoints = [];
		if (vm.selectedDataPoints.length == 0) {
			setdatapoints = vm.dataPoints;
		}
		else {
			setdatapoints = vm.selectedDataPoints;
		}
		//vm.selectedDataPoints = vm.dataPoints;
		var datapoints = '';
		angular.forEach(setdatapoints, function (datapoint) {
			datapoints += datapoint.name + "|";
		});
		datapoints = datapoints.substr(0, datapoints.length - 1);
		return datapoints;
	}
	//fetchData function to get initial data and on fetchData click
	function fetchData(firstTime, fromClick) {
		vm.showError=false;
		if(validateForm())
			return false;
		vm.recordsCount = 0;
		vm.totalCount = 0;
		vm.page = 0;
		vm.isFetchingData = true;
		vm.patientProviderData = [];
		var datapoints = '';

		if (fromClick) {
			vm.loading = true;
		}
		//vm.filter.state=vm.filter.state.toUpperCase();
		if (firstTime) {

			var initDataPoints = ['DRGDefinition', 'ProviderId', 'ProviderName', 'TotalDischarges', 'AverageCoveredCharges', 'AverageTotalPayments']
			angular.forEach(vm.dataPoints, function (datapoint) {
				if (initDataPoints.indexOf(datapoint.name) > -1) {
					vm.selectedDataPoints.push(datapoint);
					datapoints += datapoint.name + "|";
				}

			});
			datapoints = datapoints.substr(0, datapoints.length - 1);
		}
		else {
			datapoints = getDataPoints();
		}

		patientProviderService.getPatientProviderData(datapoints, vm.filter).then(function (response) {
			if (response.status == 200) {
				var colDefs = [];
				if (response.data.data.length > 0) {
					$scope.data = response.data.data;
					colDefs = Object.keys($scope.data[0]);
				}
				else {
					$scope.data = [];
					if (vm.selectedDataPoints.length > 0) {
						angular.forEach(vm.selectedDataPoints, function (datapoint) {
							colDefs.push(datapoint.name);
						});
					}
				}
				
				prepareGridColumns(colDefs);
				prepareGridOptions();

				if ($scope.data.length < 50) {
					$scope.gridApi.infiniteScroll.dataLoaded(false, false);

				}
				else {
					vm.page += 1;
				}
				if (!firstTime) {
					$scope.gridApi.infiniteScroll.resetScroll();
					$scope.gridApi.infiniteScroll.dataLoaded();
				}

				vm.recordsCount = vm.gridOptions.data.length;
				vm.totalCount = response.data.totalCount;
				vm.isFetchingData = false;
				vm.loading = false;
				vm.firstTime = false;
			}
		});
	}

	//Prepare Columns for UI Grid
	function prepareGridColumns(colDefs)
	{
		$scope.cols = [];
		/*var idIndex = colDefs.indexOf('_id');
		if (idIndex > -1) {
			colDefs.splice(idIndex, 1);
		}*/
		angular.forEach(vm.dataPoints, function(datapoint, index) {
		    if (colDefs.indexOf(datapoint.name) > -1) {
		        adjustWidth(colDefs, datapoint, index);
		        $scope.cols.push(datapoint);
		        //vm.gridOptions.columnDefs = $scope.cols;
		    }
		});
	}

	//Configure UI Grid 
	function prepareGridOptions()
	{
		vm.gridOptions = {
			infiniteScrollRowsFromEnd: 10,
			infiniteScrollUp: false,
			infiniteScrollDown: true,
			enableSorting: false,
			columnDefs: $scope.cols,
			data: $scope.data,
			onRegisterApi: function (gridApi) {
				gridApi.infiniteScroll.on.needLoadMoreData($scope, vm.getMoreData);
				$scope.gridApi = gridApi;
			}
		};
	}

	// On DataPoints Selection/Removal
	function onDataPointSelect()
	{
		if (!vm.firstTime) {
			vm.page = 0;
			fetchData(vm.firstTime, false);
		}
	}
	
	//Function to get data on infinite scroll
	function getMoreData() {

		if (vm.isFetchingData) return;
		vm.isFetchingData = true;
		//vm.page = 1;
		var datapoints = getDataPoints();
		patientProviderService.getPatientProviderData(datapoints, vm.filter, vm.page, true).then(function (response) {
			if (response.status == 200 && response.data.data.length > 0) {
				$scope.gridApi.infiniteScroll.saveScrollPercentage();
				var colDefs = Object.keys(response.data.data[0]);
				prepareGridColumns(colDefs);
				vm.gridOptions.columnDefs = $scope.cols;
				vm.isFetchingData = false;
				vm.page += 1;
				if (response.data.data.length > 0) {
					vm.gridOptions.data = vm.gridOptions.data.concat(response.data.data);
				}
				
				$scope.gridApi.infiniteScroll.dataLoaded();
				vm.recordsCount = vm.gridOptions.data.length;
				vm.totalCount = response.data.totalCount;
				//	vm.patientProviderData.push({rows:response.data,cols:Object.keys(response.data[0])});sss
			}
			else {
				vm.isFetchingData = false;
			}

		});
	}

	
	// Set Width of Columns Based onn Number of Columns
	function adjustWidth(colDefs, datapoint, datapointIndex) {
		
		var colDefLength=colDefs.length-1;
		var width=Math.floor(100/colDefs.length);
		if(datapointIndex==0)
			datapoint.width=(100-(width*colDefLength))+"%";
		else
			datapoint.width=width+"%";
	}

	//Validate search filters
	function validateForm()
	{
		var isError=false;
		for (var property in vm.filter) {
            if (vm.filter.hasOwnProperty(property)) {
				
                if ((vm.filter[property] <0 ||vm.filter[property]===undefined) && property!=="state" ) {
				   vm.showError=true;
				   isError=true;
				}
				if(vm.filter[property]===null){
					vm.filter[property]='';
				}
            }
		}
		return isError;
	}

	//Logout of Application
	function logout() {
		authenticationService.Logout();
		$location.path('/');
	}



}]);