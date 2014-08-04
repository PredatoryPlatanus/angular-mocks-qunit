(function(){
	'use strict';
	/**
	* app Module
	*
	* Description
	*/
	angular.module('app', []).controller('derpController',
		['$scope', '$http', function($scope, $http){
			$scope.init = true;
			$http.get('/someUrl').then(function(response){
				$scope.httpGetResult = response.data;
			});
		}]);
})();