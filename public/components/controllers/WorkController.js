'use strict';

angular.module('AMQP.workController', ['ngRoute'])

.config(['$routeProvider',function($routeprovider){
	$routeprovider.when('/work', {
		controller: 'WorkController',
		templateUrl: 'components/views/workView.html'
	});
}])

// Controller definition for this module
.controller('WorkController', ['$scope', '$http', function($scope, $http) {

	// $scope.workJSON = "Wait a sec.";
	return $http.get('http://127.0.0.1:8081/workqueue').
		then(function(response) {
			$scope.workJSON = response.data[0].msg; // Might be CloudAMQP only
		}, function getError(response) {
			$scope.workJSON = response;
		});


}]);
