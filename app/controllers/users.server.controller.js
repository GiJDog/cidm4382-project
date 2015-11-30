// Invoke 'strict' JavaScript mode
'use strict';

// Loads up the dependencies for the modules
var User = require('mongoose').model('User'),
	passport = require('passport');

// Creates a new contoller for errors
var getErrorMessage = function(err) {
	// Define the error message variable
	var message = '';


	if (err.code) {
		switch (err.code) {
		
			case 11000:
			case 11001:
				message = 'Username already exists';
				break;
	
			default:
				message = 'Something went wrong';
		}
	} else {
	
		for (var errName in err.errors) {
			if (err.errors[errName].message) message = err.errors[errName].message;
		}
	}

	// Returns the message error
	return message;
};

// Creates a new method that renders the signin page
exports.renderSignin = function(req, res, next) {
	if (!req.user) {
		// Use the 'response' object to render the signin page
		res.render('signin', {
			// Set the page title variable
			title: 'Sign-in Form',
			// Set the flash message variable
			messages: req.flash('error') || req.flash('info')
		});
	} else {
		return res.redirect('/');
	}
};

// Creates a new method that renders the signup page
exports.renderSignup = function(req, res, next) {
	if (!req.user) {
		// Use the 'response' object to render the signup page
		res.render('signup', {
			// Set the page title variable
			title: 'Sign-up Form',
			// Set the flash message variable
			messages: req.flash('error')
		});
	} else {
		return res.redirect('/');
	}
};

// Create a new controller method that creates new 'regular' users
exports.signup = function(req, res, next) {
	// If user is not connected, create and login a new user, otherwise redirect the user back to the main application page
	if (!req.user) {
		// Create a new 'User' model instance
		var user = new User(req.body);
		var message = null;

		// Set the user provider property
		user.provider = 'local';

		// Try saving the new user document
		user.save(function(err) {
			// If an error occurs, use flash messages to report the error
			if (err) {
				// Use the error handling method to get the error message
				var message = getErrorMessage(err);

				// Set the flash messages
				req.flash('error', message);

				// Redirect the user back to the signup page
				return res.redirect('/signup');
			}

			// If the user was created successfully use the Passport 'login' method to login
			req.login(user, function(err) {
				// If a login error occurs move to the next middleware
				if (err) return next(err);

				// Redirect the user back to the main application page
				return res.redirect('/');
			});
		});
	} else {
		return res.redirect('/');
	}
};

// Create a new controller method that creates new 'OAuth' users
exports.saveOAuthUserProfile = function(req, profile, done) {
	// Try finding a user document that was registered using the current OAuth provider
	User.findOne({
		provider: profile.provider,
		providerId: profile.providerId
	}, function(err, user) {
		// If an error occurs continue to the next middleware
		if (err) {
			return done(err);
		} else {
			// If a user could not be found, create a new user, otherwise, continue to the next middleware
			if (!user) {
				// Set a possible base username
				var possibleUsername = profile.username || ((profile.email) ? profile.email.split('@')[0] : '');

				// Find a unique available username
				User.findUniqueUsername(possibleUsername, null, function(availableUsername) {
					// Set the available user name 
					profile.username = availableUsername;
					
					// Create the user
					user = new User(profile);

					// Try saving the new user document
					user.save(function(err) {
						// Continue to the next middleware
						return done(err, user);
					});
				});
			} else {
				// Continue to the next middleware
				return done(err, user);
			}
		}
	});
};

// Create a new controller method for signing out
exports.signout = function(req, res) {
	// Use the Passport 'logout' method to logout
	req.logout();

	// Redirect the user back to the main application page
	res.redirect('/');
};

//make sure that he user is authenticated
exports.requiresLogin = function(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).send({
      message: 'User is not logged in'
    });
  }

  next();
};