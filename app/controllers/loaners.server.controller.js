// Invoke 'strict' JavaScript mode
'use strict';

//module dependencies
var mongoose = require('mongoose'),
    Loaner = mongoose.model('Loaner');

// Create a new error handling controller method
var getErrorMessage = function(err) {
    if (err.errors) {
        for (var errName in err.errors) {
            if (err.errors[errName].message) return err.errors[errName].message;
        }
    } else {
        return 'Unknown server error';
    }
};

// Create a new controller method that creates a new loaner
exports.create = function(req, res) {
    var loaner = new Loaner(req.body);
    loaner.creator = req.user;

    loaner.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.json(loaner);
        }
    });
};

// Create a new controller method that retrieves a list of loaners
exports.list = function(req, res) {
    Loaner.find().sort('-created').populate('creator', 'firstName lastName fullName').exec(function(err, loaners) {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.json(loaners);
        }
    });
};

//Retrieves a single existing loaner
exports.loanerByID = function(req, res, next, id) {
     
    Loaner.findById(id).populate('creator', 'firstName lastName fullName').exec(function(err, loaner) {
        if (err) return next(err);
        if (!loaner) return next(new Error('Failed to load loaner ' + id));

        req.loaner = loaner;

        next();
    });
};

exports.read = function(req, res) {
    res.json(req.loaner);
};

//Updates an existing Loaner 
exports.update = function(req, res) {
    var loaner = req.loaner;
    loaner.model = req.body.model;
    
    loaner.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.json(loaner);
        }
    });
};

// Delete an existing loaner
exports.delete = function(req, res) {
    var loaner = req.loaner;
    
    loaner.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.json(loaner);
        }
    });
};



// Create a new controller middleware that is used to authorize a loaner operation 
exports.hasAuthorization = function(req, res, next) {
    if (req.loaner.creator.id !== req.user.id) {
        return res.status(403).send({
            message: 'User is not authorized'
        });
    }

    next();
};