'use strict';

/* qunit tests for angular-mocks-qunit go here */

module('angular-mocks-qunit first part tests', {
	setup:function(){
		ngModule('app');
	}
});

test('Should construct scope and controller',inject(function($rootScope, $controller){
	var $scope = $rootScope.$new();
	var controller = $controller('derpController', {$scope: $scope});
	ok($scope.init, "rootscope dependency should be resolved and used in controller");
}));

test('$httpBackend integration', inject(function($rootScope, $controller, _$httpBackend_){
	var $httpBackend = _$httpBackend_;
	$httpBackend.expectGET('/someUrl').respond(200, 'derp');
	var $scope = $rootScope.$new();
	var controller = $controller('derpController', {$scope: $scope});
	$httpBackend.flush();
	$scope.$digest();
	equal($scope.httpGetResult, 'derp', "$httpBackend should be used for $http requests");
	
	$httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
}));