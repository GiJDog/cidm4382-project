// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var admins = require('../../app/controllers/admins.server.controller'),
	passport = require('passport');

// Define the routes module' method
module.exports = function(app) {
	// Set up the 'signup' routes 
	app.route('/adminssignup')
	   .get(admins.renderSignup)
	   .post(admins.signup);

	// Set up the 'signin' routes 
	app.route('/adminssignin')
	   .get(admins.renderSignin)
	   .post(passport.authenticate('local', {
			successRedirect: '/',
			failureRedirect: '/adminssignin',
			failureFlash: true
	   }));

	// Set up the 'signout' route
	app.get('/signout', admins.signout);
};