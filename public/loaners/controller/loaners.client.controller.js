// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'loaners' controller
angular.module('loaners').controller('LoanersController', ['$scope', '$routeParams', '$location', 'Authentication', 'Loaners',
    function($scope, $routeParams, $location, Authentication, Loaners) {
        // Expose the Authentication service
        $scope.authentication = Authentication;

        // Create a new controller method for creating new loaners
        $scope.create = function() {
            // Use the form fields to create a new article $resource object
            var loaner = new Loaners({
                model: this.model,
            });

            // Use the article '$save' method to send an appropriate POST request
            loaner.$save(function(response) {
                // If an article was created successfully, redirect the user to the article's page 
                $location.path('loaners/' + response._id);
            }, function(errorResponse) {
                // Otherwise, present the user with the error message
                $scope.error = errorResponse.data.message;
            });
        };

        // Create a new controller method for retrieving a list of loaners
        $scope.find = function() {
            // Use the article 'query' method to send an appropriate GET request
            $scope.loaners = Loaners.query();
        };

        // Create a new controller method for retrieving a single article
        $scope.findOne = function() {
            // Use the article 'get' method to send an appropriate GET request
            $scope.loaner = Loaners.get({
                loanerId: $routeParams.loanerId
            });
        };

        // Create a new controller method for updating a single article
        $scope.update = function() {
            // Use the article '$update' method to send an appropriate PUT request
            $scope.loaner.$update(function() {
                // If an article was updated successfully, redirect the user to the article's page 
                $location.path('loaners/' + $scope.loaner._id);
            }, function(errorResponse) {
                // Otherwise, present the user with the error message
                $scope.error = errorResponse.data.message;
            });
        };

        // Create a new controller method for deleting a single article
        $scope.delete = function(loaner) {
            // If an article was sent to the method, delete it
            if (loaner) {
                // Use the article '$remove' method to delete the article
                loaner.$remove(function() {
                    // Remove the article from the loaners list
                    for (var i in $scope.loaners) {
                        if ($scope.loaners[i] === loaner) {
                            $scope.loaners.splice(i, 1);
                        }
                    }
                });
            } else {
                // Otherwise, use the article '$remove' method to delete the article
                $scope.loaner.$remove(function() {
                    $location.path('loaners');
                });
            }
        };
    }
]);