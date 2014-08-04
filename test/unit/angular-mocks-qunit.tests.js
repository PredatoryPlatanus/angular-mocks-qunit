/* qunit tests for angular-mocks-qunit go here */

module('angular-mocks-qunit inject in test', {
	setup: function () {
		ngModule('app');
	}
});

test('Should construct scope and controller', inject(function ($rootScope, $controller) {
	var $scope = $rootScope.$new();
	var controller = $controller('derpController', {
		$scope: $scope
	});
	ok(controller, "controller should be found");
	ok($scope.init, "rootscope dependency should be resolved and used in controller");
}));

test('$httpBackend integration', inject(function ($rootScope, $controller, _$httpBackend_) {
	var $httpBackend = _$httpBackend_;
	$httpBackend.expectGET('/someUrl').respond(200, 'derp');
	var $scope = $rootScope.$new();
	var controller = $controller('derpController', {
		$scope: $scope
	});
	$httpBackend.flush();
	$scope.$digest();
	equal($scope.httpGetResult, 'derp', "$httpBackend should be used for $http requests");

	$httpBackend.verifyNoOutstandingExpectation();
	$httpBackend.verifyNoOutstandingRequest();
}));


module('angular-mock-qunit inject in setup', {
	setup: function () {
		var self = this;
		ngModule('app');
		inject(function ($rootScope, $controller) {
			self.$scope = $rootScope.$new();
			self.controller = $controller('derpController', {
				$scope: self.$scope
			});
		});
	}
});

test('applying data from setup function', function () {
	ok(this.controller, "controller should be found");
	ok(this.$scope.init, "rootscope dependency should be resolved and used in controller");
});


module('angular-mocks-qunit first $provide override tests', {
	setup: function () {
		ngModule(function ($provide) {
			$provide.constant('SOME_CONSTANT', 'DERP');
		});
	}
});

test('module $provide override', inject(function (SOME_CONSTANT) {
	equal(SOME_CONSTANT, 'DERP', "$provide should work");
}));