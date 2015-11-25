// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var Admin = require('mongoose').model('Admin'),
	passport = require('passport');

// Create a new error handling controller method
var getErrorMessage = function(err) {
	// Define the error message variable
	var message = '';

	// If an internal MongoDB error occurs get the error message
	if (err.code) {
		switch (err.code) {
			// If a unique index error occurs set the message error
			case 11000:
			case 11001:
				message = 'Adminname already exists';
				break;
			// If a general error occurs set the message error
			default:
				message = 'Something went wrong';
		}
	} else {
		// Grab the first error message from a list of possible errors
		for (var errName in err.errors) {
			if (err.errors[errName].message) message = err.errors[errName].message;
		}
	}

	// Return the message error
	return message;
};

// Create a new controller method that renders the signin page
exports.renderSignin = function(req, res, next) {
	// If admin is not connected render the signin page, otherwise redirect the admin back to the main application page
	if (!req.admin) {
		// Use the 'response' object to render the signin page
		res.render('adminssignin', {
			// Set the page title variable
			title: 'Sign-in Form',
			// Set the flash message variable
			messages: req.flash('error') || req.flash('info')
		});
	} else {
		return res.redirect('/');
	}
};

// Create a new controller method that renders the signup page
exports.renderSignup = function(req, res, next) {
	// If admin is not connected render the signup page, otherwise redirect the admin back to the main application page
	if (!req.admin) {
		// Use the 'response' object to render the signup page
		res.render('adminssignup', {
			// Set the page title variable
			title: 'Sign-up Form',
			// Set the flash message variable
			messages: req.flash('error')
		});
	} else {
		return res.redirect('/');
	}
};

// Create a new controller method that creates new 'regular' admins
exports.signup = function(req, res, next) {
	// If admin is not connected, create and login a new admin, otherwise redirect the admin back to the main application page
	if (!req.admin) {
		// Create a new 'Admin' model instance
		var admin = new Admin(req.body);
		var message = null;

		// Set the admin provider property
		admin.provider = 'local';

		// Try saving the new admin document
		admin.save(function(err) {
			// If an error occurs, use flash messages to report the error
			if (err) {
				// Use the error handling method to get the error message
				var message = getErrorMessage(err);

				// Set the flash messages
				req.flash('error', message);

				// Redirect the admin back to the signup page
				return res.redirect('/adminssignup');
			}

			// If the admin was created successfully use the Passport 'login' method to login
			req.login(admin, function(err) {
				// If a login error occurs move to the next middleware
				if (err) return next(err);

				// Redirect the admin back to the main application page
				return res.redirect('/');
			});
		});
	} else {
		return res.redirect('/');
	}
};

// Create a new controller method that creates new 'OAuth' admins
exports.saveOAuthAdminProfile = function(req, profile, done) {
	// Try finding a admin document that was registered using the current OAuth provider
	Admin.findOne({
		provider: profile.provider,
		providerId: profile.providerId
	}, function(err, admin) {
		// If an error occurs continue to the next middleware
		if (err) {
			return done(err);
		} else {
			// If a admin could not be found, create a new admin, otherwise, continue to the next middleware
			if (!admin) {
				// Set a possible base adminname
				var possibleAdminname = profile.adminname || ((profile.email) ? profile.email.split('@')[0] : '');

				// Find a unique available adminname
				Admin.findUniqueAdminname(possibleAdminname, null, function(availableAdminname) {
					// Set the available admin name 
					profile.adminname = availableAdminname;
					
					// Create the admin
					admin = new Admin(profile);

					// Try saving the new admin document
					admin.save(function(err) {
						// Continue to the next middleware
						return done(err, admin);
					});
				});
			} else {
				// Continue to the next middleware
				return done(err, admin);
			}
		}
	});
};

// Create a new controller method for signing out
exports.signout = function(req, res) {
	// Use the Passport 'logout' method to logout
	req.logout();

	// Redirect the admin back to the main application page
	res.redirect('/');
};

//make sure that he admin is authenticated
exports.requiresLogin = function(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).send({
      message: 'Admin is not logged in'
    });
  }

  next();
};