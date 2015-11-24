var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var LoanerSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    model: {
        type: String,
        default: '',
        trim: true,
        required: 'Model cannot be blank'
    },
    modelType: {
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