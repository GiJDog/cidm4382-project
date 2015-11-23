// Invoke 'strict' JavaScript mode
'use strict';

// Configure the 'loaners' module routes
angular.module('loaners').config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/', {
            templateUrl: 'loaners/views/list-loaners.client.view.html'
        }).
        when('/loaners/create', {
            templateUrl: 'loaners/views/create-loaner.client.view.html'
        }).
        when('/loaners/:loanerId', {
            templateUrl: 'loaners/views/view-loaner.client.view.html'
        }).
        when('/loaners/:loanerId/edit', {
            templateUrl: 'loaners/views/edit-loaner.client.view.html'
        });
    }
]); 