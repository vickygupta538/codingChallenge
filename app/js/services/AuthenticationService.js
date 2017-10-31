app.service('authenticationService', ['$http', '$localStorage', function ($http, $localStorage) {
    //var service = {};
    var self=this;
    self.Login = Login;
    self.Logout = Logout;
    self.Register = Register;
    //return service;

    //Login function to get authenticated with backend service
    function Login(user, callback) {
        $http({method:'POST',url:'/authenticate', data: 'username='+ user.username+ '&password='+ user.password , headers:{'Content-Type': 'application/x-www-form-urlencoded'}})
            .success(function (response) {
                // login successful if there's a token in the response
                if (response.token) {
                    // store username and token in local storage to keep user logged in between page refreshes
                    $localStorage.loggedInUser = { username: user.username, token: response.token };

                    // execute callback with true to indicate successful login
                    callback(response);
                } else {
                    // execute callback with false to indicate failed login
                    callback(response);
                }
            });
    }

    //function to log off delete session from local storage

    function Logout() {
        // remove user from local storage and clear http auth header
       delete $localStorage.loggedInUser;
       
     //  callback(true);
       return true;
        // $http.defaults.headers.common.Authorization = '';
    }

    function Register(user, callback) {
        $http({method:'POST',url:'/register', data: 'username='+ user.username+ '&password='+ user.password , headers:{'Content-Type': 'application/x-www-form-urlencoded'}})
            .success(function (response) {
                // login successful if there's a token in the response
                if (response.success) {
                    // execute callback with true to indicate successful login
                    callback(response);
                } else {
                    // execute callback with false to indicate failed login
                    callback(response);
                }
            });
    }

}]);