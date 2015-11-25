// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var mongoose = require('mongoose'),
	crypto = require('crypto'),
	Schema = mongoose.Schema;

// Define a new 'AdminSchema'
var AdminSchema = new Schema({
	firstName: String,
	lastName: String,
	email: {
		type: String,
		// Validate the email format
		match: [/.+\@.+\..+/, "Please fill a valid email address"]
	},
	adminname: {
		type: String,
		// Set a unique 'adminname' index
		unique: true,
		// Validate 'adminname' value existance
		required: 'Adminname is required',
		// Trim the 'adminname' field
		trim: true
	},
	adminpassword: {
		type: String,
		// Validate the 'adminpassword' value length
		validate: [

			function(adminpassword) {
				return adminpassword && adminpassword.length > 6;
			}, 'Password should be longer'
		]
	},
	salt: {
		type: String
	},
	provider: {
		type: String,
		// Validate 'provider' value existance
		required: 'Provider is required'
	},
	providerId: String,
	providerData: {},
	created: {
		type: Date,
		// Create a default 'created' value
		default: Date.now
	}
});

// Set the 'fullname' virtual property
AdminSchema.virtual('fullName').get(function() {
	return this.firstName + ' ' + this.lastName;
}).set(function(fullName) {
	var splitName = fullName.split(' ');
	this.firstName = splitName[0] || '';
	this.lastName = splitName[1] || '';
});

// Use a pre-save middleware to hash the adminpassword
/*AdminSchema.pre('save', function(next) {
	if (this.adminpassword) {
		this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
		this.adminpassword = this.hashPassword(this.adminpassword);
	}

	next();
});

// Create an instance method for hashing a adminpassword
AdminSchema.methods.hashPassword = function(adminpassword) {
	return crypto.pbkdf2Sync(adminpassword, this.salt, 10000, 64).toString('base64');
};

// Create an instance method for authenticating admin
AdminSchema.methods.authenticate = function(adminpassword) {
	return this.adminpassword === this.hashPassword(adminpassword);
};
*/

// Find possible not used adminname
AdminSchema.statics.findUniqueAdminname = function(adminname, suffix, callback) {
	var _this = this;

	// Add a 'adminname' suffix
	var possibleAdminname = adminname + (suffix || '');

	// Use the 'Admin' model 'findOne' method to find an available unique adminname
	_this.findOne({
		adminname: possibleAdminname
	}, function(err, admin) {
		// If an error occurs call the callback with a null value, otherwise find find an available unique adminname
		if (!err) {
			// If an available unique adminname was found call the callback method, otherwise call the 'findUniqueAdminname' method again with a new suffix
			if (!admin) {
				callback(possibleAdminname);
			} else {
				return _this.findUniqueAdminname(adminname, (suffix || 0) + 1, callback);
			}
		} else {
			callback(null);
		}
	});
};

// Configure the 'AdminSchema' to use getters and virtuals when transforming to JSON
AdminSchema.set('toJSON', {
	getters: true,
	virtuals: true
});

// Create the 'Admin' model out of the 'AdminSchema'
mongoose.model('Admin', AdminSchema);