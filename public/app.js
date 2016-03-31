'use strict';

// Defining Angular app model with all other dependent modules
const AMQP = angular.module('AMQP',
	['ngRoute',
	'AMQP.workController',
	'AMQP.resultController',
	'AMQP.settingsController'
	]);

AMQP.config(function($routeProvider, $locationProvider, $httpProvider) {

	$routeProvider.otherwise({ redirectTo: '/results'});

	// Settings for http communications
	$httpProvider.defaults.useXDomain = true;
	delete $httpProvider.defaults.headers.common['X-Requested-With'];
});
