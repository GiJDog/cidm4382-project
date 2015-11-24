angular.module('loaners').factory('Loaners', ['$resource', function($resource) {
    return $resource('api/loaners/:loanerId', {
        loanerId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);