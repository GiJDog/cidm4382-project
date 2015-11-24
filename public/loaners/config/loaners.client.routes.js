angular.module('loaners').config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/loaners', {
            templateUrl: 'public/loaners/views/list-loaners.client.view.html'
        }).
        when('/loaners/create', {
            templateUrl: 'public/loaners/views/create-loaner.client.view.html'
        }).
        when('/loaners/:loanerId', {
            templateUrl: 'public/loaners/views/view-loaner.client.view.html'
        }).
        when('/loaners/:loanerId/edit', {
            templateUrl: 'public/loaners/views/edit-loaner.client.view.html'
        });
    }
]);