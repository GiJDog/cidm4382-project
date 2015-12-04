var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//This establishes the schema for the Loaners model

var LoanerSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    model: {
        type: String,
        default: '',
        trim: true,
        //Makes sure there is a value
        required: 'Model cannot be blank'
    },
    serialNumber: {
        type: String,
        default: '',
        trim: true
    },
    creator: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

mongoose.model('Loaner', LoanerSchema);