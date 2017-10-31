# Coding Challenge

This is a solution of a coding challenge.

Live Demo:
https://patientprovidersapp.herokuapp.com

The solution is based on MEAN Stack.

Tech Stack Details & Versions:

Angular JS  v1.4.14
Node JS  v8.8.1
MongoDb - Mlabs.com

Architecture Details:

Frontend:

Used BootStrap for UI Designing and responsiveness.

Used Angular JS for frontend functionality. In Angular JS, Used UI Grid for infinite scroll to display data in chunks and to avoid 'ng-repeat' of Angular JS.

Applications has two views: 

Login.html -- For login/SignUp of users.
PatientProvider.html -- To display filters and UI Grid to diplay data.

It also has two services respectively for each view/controller.

AuthenticationService: To authenticate and register user.
PatientProviderService: To fetch data based on the filters applied with the help of node API's.

Backend:

Developed three API's with the help of node and express.
/Provider: To exposed patient providers data based on the filters and datapoints from the mongoDb.
/Register: To register new user.
/Authenticate: To authenticate existing user and provide a token to be used in further API(/Provider) call. 

Used Mongoose for Mongo DB connection setup and mLab for remote mongodb services on heroku.
With the help of Mongoose, dynamic selection of datapoints(columns) to be fetched from MongoDb.

Unit Test Cases:
Used Karma JS and Jasmine JS to write unit test cases.


Achievements:

An API endpoint that implements the url ending with /providers.
Every possible combination of query string parameters works.
Some datastore is used.
All responsive pages implemented (as well as any HTML/CSS/Javascript associated with it).
Automated tests (i.e. Unit Tests Cases can be run from command line).
Bonus 1 Selected datapoints from API Response.
Bonus 2 Login Page, User Authentication and API authorization.

Aplication Setup:

Project contains all the required dependencies. But, if someone wants to setup it manually.
Then,

run command "npm install" for node related dependencies
run command "bower install" for angular related dependencies

run command "node server.js" to start.

run command "karma start" to run the unit test cases.







