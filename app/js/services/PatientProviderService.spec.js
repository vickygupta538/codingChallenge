describe('Patient Service', function () {
    var PatientProviderService;
    var httpBackend;
    var orgTimeout;
    var LoginObj = {};
    LoginObj.username = "Admin";
    LoginObj.password = "Admin";
    var myData, store;
    var datapoints, filterObj,page, fromScroll;
    filterObj=JSON.parse('{"max_discharges":"","min_discharges":"","state":"","max_avg_covered_charges":"","min_avg_covered_charges":"","max_avg_medicare_payments":"","min_avg_medicare_payments":""}')
    page=1;
    fromScroll=false;

    var url = "http://localhost:3000";
    var username = 'Admin';
    var password = 'Admin';
    var querystring = '';
    for (var property in filterObj) {
        if (filterObj.hasOwnProperty(property)) {
            if (filterObj[property] != '') {
                querystring += property + "=" + filterObj[property] + "&";
            }
        }
    }

    // Before each test load our api.users module
    beforeEach(angular.mock.module('app'));

    // Before each test set our injected Users factory (_Users_) to our local Users variable
    beforeEach(inject(function ($httpBackend,_patientProviderService_) {
        PatientProviderService = _patientProviderService_;
        httpBackend = $httpBackend;
      //  localStorage.loggedInUser.token="fgfdgfdgfdh";
    }));
    /*beforeEach(function() {
    inject(function($injector) {
      PatientProviderService = $injector.get('patientProvideService');
    });
 });*/
    beforeEach(function () {
       // mockLocalStorage();
      });    
    beforeEach(function () {
        orgTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    });
    
    // beforeEach(inject(function(_myData_) {
    //   myData = _myData_;
    //   store = {};
    //   var localStorage = window.localStorage;
    //   spyOn(localStorage, 'getItem').and.callFake(function (key) {
    //     return store[key];
    //   });
    //   spyOn(localStorage, 'setItem').and.callFake(function (key, value) {
    //     return store[key] = value + '';
    //   });
    //   spyOn(localStorage, 'clear').and.callFake(function () {
    //     store = {};
    //   });
    // }));

    afterEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = orgTimeout;
       // localStorage.loggedInUser.token="";
    });
    // A simple test to verify the Users factory exists
    it('should exist', function () {
        expect(PatientProviderService).toBeDefined();
    });
    it('Login method should exist', function () {
        expect(PatientProviderService.getPatientProviderData()).toBeDefined();
    });
  
    it('Expect PatientProvider To have headers', function () {
        var headerObj = {
            'x-access-token': 'fghghdfgvdhbcvbngfnjxzcgf',
             'content-type': 'application/x-www-form-urlencoded',
             'options': 'Datapoints to Fetch space seperated'
           };
        httpBackend.expect('GET', '/providers?'+querystring)
          .respond({ headerObj });
       //   unmockLocalStorage();
          localStorage['currentUser'] = {
              username:'dsgffdg',
              token:'gfdg'
          };
          PatientProviderService.getPatientProviderData(datapoints,filterObj,page,fromScroll, function (headers) {
          console.log(headers.headerObj);
          expect(headers.headerObj["x-access-token"]).toBe('fghghdfgvdhbcvbngfnjxzcgf');
          expect(headers.headerObj["content-type"]).toBe('application/x-www-form-urlencoded');
          expect(headers.headerObj["options"]).toBe('Datapoints to Fetch space seperated');

        });
        httpBackend.flush();
    
      });

        
    it('Expect PatientProvider To return Success', function () {
        var responseObj = {
            success:true
            };
                    //   unmockLocalStorage();
         
           httpBackend.expect('GET', '/providers?'+querystring)
           .respond({ responseObj });
             PatientProviderService.getPatientProviderData(datapoints,filterObj,page,fromScroll, function (response) {
             console.log(response.responseObj);
             expect(response.responseObj.success).toBe(true);
   
           });
           httpBackend.flush();
       
         });

         it('Expect PatientProvider To return data', function () {
            var responseObj = {
                success:true,
                data:"fgfdghhf"
                };
                        //   unmockLocalStorage();
             
               httpBackend.expect('GET', '/providers?'+querystring)
               .respond({ responseObj });
                 PatientProviderService.getPatientProviderData(datapoints,filterObj,page,fromScroll, function (response) {
                 console.log(response.responseObj);
                 expect(response.responseObj.data).toBe("fgfdghhf");
       
               });
               httpBackend.flush();
           
             });
});