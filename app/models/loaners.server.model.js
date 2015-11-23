// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// Define a new 'LoanerSchema'
var LoanerSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    model: {
        type: String,
        default: '',
        trim: true,
        required: 'Title cannot be blank'
    },

    creator: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

mongoose.model('Loaner', LoanerSchema);