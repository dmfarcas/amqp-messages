// AboutController.js
// For distribution, all controllers
// are concatanated into single app.js file
// by using Gulp

'use strict';

angular.module('AMQP.settingsController', ['ngRoute'])

// Routing configuration for this module
.config(['$routeProvider',function($routeprovider){
	$routeprovider.when('/settings', {
		controller: 'SettingsController',
		templateUrl: 'components/views/settingsView.html'
	});
}])

// Controller definition for this module
.controller('SettingsController', ['$scope', function($scope) {

	$scope.message = "Hello Settings!";

}]);
