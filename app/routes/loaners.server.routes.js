var users = require('../../app/controllers/users.server.controller'),
    loaners = require('../../app/controllers/loaners.server.controller');

//HTTP and REST service endpoints for loaners.

module.exports = function(app) {
    app.route('/api/loaners')
        .get(loaners.list)
        .post(users.requiresLogin, loaners.create);

    app.route('/api/loaners/:loanerId')
        .get(loaners.read)
        .put(users.requiresLogin, loaners.hasAuthorization, loaners.update)
        .delete(users.requiresLogin, loaners.hasAuthorization, loaners.delete);

    app.param('loanerId', loaners.loanerByID);
};