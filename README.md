
# Angular-mocks-qunit [![Build Status](https://travis-ci.org/PredatoryPlatanus/angular-mocks-qunit.png?branch=master)](https://travis-ci.org/PredatoryPlatanus/angular-mocks-qunit)
> Angular-mocks-qunit - lets you use inject() and ngModule() in Qunit

Angular-mocks does not fully support Qunit framework hence inject and module functions are not available.

## Usage

Install `angular-mocks-qunit`:
```
npm install angular-mocks-qunit
```

Include
```
angular-mocks-qunit.js in your tests
```

Since Qunit already has module function defined angular-mocks function is renamed to ngModule.

Inject isnt changed.

Both work the same way as they do in Jasmine/Mocha.
