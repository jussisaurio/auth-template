const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs'); // password encryption

// Define our model
const userSchema = new Schema({
	email: {type: String, unique: true, lowercase: true},
	password: String // literal reference to JS String
});

// On Save hook, encrypt password
// Before saving a model, run this function
userSchema.pre('save', function(next){

	// get access to the user model instance (the one being saved)
	const user = this;

	// generate a salt, then run callback
	bcrypt.genSalt(10, function(err,salt){
		// error check
		if (err) {return next(err); }

		// hash(encrypt) the user's password with the salt, then run callback
		bcrypt.hash(user.password, salt, null, function (err, hash) {
			if (err) {return next(err); }

			// overwrite plaintext password with encrypted password
			user.password = hash;
			// next handler, i.e. go ahead and save the model
			next();
		})
	});

});

userSchema.methods.comparePW = function(candidatePW, callback) {

	bcrypt.compare(candidatePW, this.password, function(err, match) {
		if (err) {return callback(err);}

		callback(null, match);
	});
};




// Create the model class - loads the model to Mongoose and it corresponds to the name 'user'
const UserClass = mongoose.model('user', userSchema);

// Export the model
module.exports = UserClass;