// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// Define a new 'ArticleSchema'
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
    /*
    content: {
        type: String,
        default: '',
        trim: true
    },
    */
    creator: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

// Create the 'Article' model out of the 'ArticleSchema'
mongoose.model('Loaner', ArticleSchema);