// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'articles' service
angular.module('loaners').factory('Loaners', ['$resource', function($resource) {
    // Use the '$resource' service to return a loaner '$resource' object
    return $resource('api/loaners/:loanerId', {
        loanerId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}])