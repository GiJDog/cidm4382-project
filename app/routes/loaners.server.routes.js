// Invoke 'strict' JavaScript mode
'use strict';

// module dependencies
var users = require('../../app/controllers/users.server.controller'),
    loaners = require('../../app/controllers/loaners.server.controller');

// Define the routes module' method
module.exports = function(app) {
    // Set up the 'loaners' base routes 
    app.route('/api/loaners')
       .get(loaners.list)
       .post(users.requiresLogin, loaners.create);

    // Set up the 'loaners' parameterized routes
    app.route('/api/loaners/:loanerId')
       .get(loaners.read)
       .put(users.requiresLogin, loaners.hasAuthorization, loaners.update)
       .delete(users.requiresLogin, loaners.hasAuthorization, loaners.delete);

    // Set up the 'loanerId' parameter middleware   
    app.param('loanerId', loaners.loanerByID);
};