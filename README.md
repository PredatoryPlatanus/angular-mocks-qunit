
# Angular-mocks-qunit [![Build Status](https://travis-ci.org/PredatoryPlatanus/angular-mocks-qunit.png?branch=master)](https://travis-ci.org/PredatoryPlatanus/angular-mocks-qunit)
> Angular-mocks-qunit - lets you use `inject()` and `ngModule()` in Qunit

Angular-mocks does not fully support Qunit framework hence inject and module functions are not available.

## Usage

Install `angular-mocks-qunit`:
```
npm install angular-mocks-qunit
```

---------------------------------------

Since Qunit already has `module()` defined angular-mocks function is renamed to `ngModule()`.

`Inject()` isnt changed.

Both work the same way as they do in Jasmine/Mocha ie

```
module('use example', {
	setup:function(){
		ngModule('app');
		
		ngModule(function($provide){
		  $provide.constant(CONSTANT, 'value');
		});
		
		inject(function($rootScope, $controller, _$httpBackend_){
		  $httpBackend = _$httpBackend_;
			$scope = $rootScope.$new();
			var myController = $controller('myController', {$scope: $scope});
		});
	}
});
```
