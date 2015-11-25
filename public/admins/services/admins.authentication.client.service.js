// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'Authentication' service
angular.module('admins').factory('Authentication', [
	function() {
		// Use the rendered admin object
		this.admin = window.admin;

		// Return the authenticated admin data
		return {
			admin: this.admin
		};
	}
]);
