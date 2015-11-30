var mongoose = require('mongoose'),
    Loaner = mongoose.model('Loaner');

// This will check for errors
var getErrorMessage = function(err) {
    if (err.errors) {
        for (var errName in err.errors) {
            if (err.errors[errName].message) return err.errors[errName].message;
        }
    }
    else {
        return 'Unknown server error';
    }
};

// This checks for authorization
exports.hasAuthorization = function(req, res, next) {
    if (req.loaner.creator.id !== req.user.id) {
        return res.status(403).send({
            message: 'User is not authorized'
        });
    }
    next();
};

// Create for express
exports.create = function(req, res) {
    var loaner = new Loaner(req.body);

    //this is the authenticated Passport user
    loaner.creator = req.user;

    loaner.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        }
        else {
            res.json(loaner);
        }
    });
};

//List and read for express
exports.list = function(req, res) {
    Loaner.find().sort('-created').populate('creator', 'firstName   lastName fullName').exec(function(err, loaners) {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        }
        else {
            res.json(loaners);
        }
    });
};

//This will find and entry based on ID
exports.loanerByID = function(req, res, next, id) {
    Loaner.findById(id).populate('creator', 'firstName lastName fullName').exec(function(err, loaner) {
        if (err) return next(err);
        if (!loaner) return next(new Error('Failed to load loaner ' + id));

        req.loaner = loaner;
        next();
    });
};

//This function reads the loaner
exports.read = function(req, res) {
    res.json(req.loaner);
};

//This function will update the loaner.
exports.update = function(req, res) {
    var loaner = req.loaner;

    //makeupdates to model and modelType
    loaner.model = req.body.model;
    loaner.modelType = req.body.modelType;

    //call save on the Mongoose model
    loaner.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        }
        else {
            res.json(loaner);
        }
    });
};

//This will delete the loaner.
exports.delete = function(req, res) {
    var loaner = req.loaner;

    loaner.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        }
        else {
            res.json(loaner);
        }
    });
};
