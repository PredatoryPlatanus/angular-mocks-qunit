/*
 * Provides 'inject' and 'module' functions
 * use to qunit from angular mocks.
 * 
 * 'module' function is renamed to 'ngModule'
 * since qunit already has its own 'module' function.
 * 
 * Usage is the same as in bare angular-mocks
 * when using it with jasmine / mocha.
 */
(function (window) {
    'use strict';

    if (window.QUnit) {

        var currentSpec = null,
            isSpecRunning = function() {
                return currentSpec && currentSpec.config.queue.length > 0;
            };
        var beforeEach = testStart;
        var afterEach = testDone;


        beforeEach(function() {
            currentSpec = this;
        });

        afterEach(function() {
            var injector = currentSpec.$injector;

            currentSpec.$injector = null;
            currentSpec.$modules = null;
            currentSpec = null;

            if (injector) {
                injector.get('$rootElement').off();
                injector.get('$browser').pollFns.length = 0;
            }

            angular.mock.clearDataCache();

            // clean up jquery's fragment cache
            angular.forEach(angular.element.fragments, function(val, key) {
                delete angular.element.fragments[key];
            });

            MockXhr.$$lastInstance = null;

            angular.forEach(angular.callbacks, function(val, key) {
                delete angular.callbacks[key];
            });
            angular.callbacks.counter = 0;
        });
    }

    function MockXhr() {

        // hack for testing $http, $httpBackend
        MockXhr.$$lastInstance = this;

        this.open = function (method, url, async) {
            this.$$method = method;
            this.$$url = url;
            this.$$async = async;
            this.$$reqHeaders = {};
            this.$$respHeaders = {};
        };

        this.send = function (data) {
            this.$$data = data;
        };

        this.setRequestHeader = function (key, value) {
            this.$$reqHeaders[key] = value;
        };

        this.getResponseHeader = function (name) {
            // the lookup must be case insensitive,
            // that's why we try two quick lookups first and full scan last
            var header = this.$$respHeaders[name];
            if (header) return header;

            name = angular.lowercase(name);
            header = this.$$respHeaders[name];
            if (header) return header;

            header = undefined;
            angular.forEach(this.$$respHeaders, function (headerVal, headerName) {
                if (!header && angular.lowercase(headerName) == name) header = headerVal;
            });
            return header;
        };

        this.getAllResponseHeaders = function () {
            var lines = [];

            angular.forEach(this.$$respHeaders, function (value, key) {
                lines.push(key + ': ' + value);
            });
            return lines.join('\n');
        };

        this.abort = angular.noop;
    }

    window.ngModule = angular.mock.module = function() {
            var moduleFns = Array.prototype.slice.call(arguments, 0);
            return isSpecRunning() ? workFn() : workFn;
            /////////////////////
            function workFn() {
                if (currentSpec.$injector) {
                    throw new Error('Injector already created, can not register a module!');
                } else {
                    var modules = currentSpec.$modules || (currentSpec.$modules = []);
                    angular.forEach(moduleFns, function(module) {
                        if (angular.isObject(module) && !angular.isArray(module)) {
                            modules.push(function($provide) {
                                angular.forEach(module, function(value, key) {
                                    $provide.value(key, value);
                                });
                            });
                        } else {
                            modules.push(module);
                        }
                    });
                }
            }
    };

    window.inject = angular.mock.inject = function () {
        var blockFns = Array.prototype.slice.call(arguments, 0);
        var errorForStack = new Error('Declaration Location');
        return isSpecRunning() ? workFn.call(currentSpec) : workFn;
        /////////////////////
        function workFn() {
            var modules = currentSpec.$modules || [];

            modules.unshift('ngMock');
            modules.unshift('ng');
            var injector = currentSpec.$injector;
            if (!injector) {
                injector = currentSpec.$injector = angular.injector(modules);
            }
            for (var i = 0, ii = blockFns.length; i < ii; i++) {
                try {
                    /* jshint -W040 *//* Jasmine explicitly provides a `this` object when calling functions */
                    injector.invoke(blockFns[i] || angular.noop, this);
                    /* jshint +W040 */
                } catch (e) {
                    if (e.stack && errorForStack) {
                        throw new ErrorAddingDeclarationLocationStack(e, errorForStack);
                    }
                    throw e;
                } finally {
                    errorForStack = null;
                }
            }
        }
    };

    var ErrorAddingDeclarationLocationStack = function (e, errorForStack) {
        this.message = e.message;
        this.name = e.name;
        if (e.line) this.line = e.line;
        if (e.sourceId) this.sourceId = e.sourceId;
        if (e.stack && errorForStack)
            this.stack = e.stack + '\n' + errorForStack.stack;
        if (e.stackArray) this.stackArray = e.stackArray;
    };
    ErrorAddingDeclarationLocationStack.prototype.toString = Error.prototype.toString;
})(window, window.angular);