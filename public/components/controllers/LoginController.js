// HomeController.js
// For distribution, all controllers
// are concatanated into single app.js file
// by using Gulp

'use strict';

angular.module('AMQP.resultController', ['ngRoute'])

// Routing configuration for this module
.config(['$routeProvider',function($routeprovider){
	$routeprovider.when('/results', {
		controller: 'ResultController',
		templateUrl: 'components/views/resultView.html'
	});
}])

// Controller definition for this module
.controller('ResultController', function($scope,$http,$timeout) {
	$scope.message = "This is the result controller."
});
