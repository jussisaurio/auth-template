const jwt = require('jwt-simple'); // JSON web token generator

const User = require('../models/user'); // collection of users
const config = require('../config');

function tokenForUser(user){
	const timestamp = new Date().getTime();

	// JSON web token conventions: sub = subject (who is this user), iat = issued at time
	return jwt.encode({ sub: user.id, iat: timestamp}, config.secret); 
}

module.exports.signin = function(req, res, next) {
	// User has already had their email and PW authed, so now they just need a token.
	res.send( {token: tokenForUser(req.user)});
}

module.exports.signup = function (req, res, next) {

	const email = req.body.email;
	const password = req.body.password;

	// Check that email and password were entered
	if (!email || !password) {

		return res.status(422).send ({error: 'You must enter both email and password'});
	}

	// Check if email exists in db
	User.findOne({ email: email }, function(err, existingUser){

		if (err) return next(err);

		// If a user does exist, return an error
		if (existingUser) {
			return res.status(422).send({error: 'Email is in use!'});
		}
	});

	// If no, create the user in memory first
	const user = new User({
		email: email,
		password: password
	});

	// Save to Mongo database, return a callback
	user.save(function(err) {

		if (err) { return next(err);}

		// Respond to req indicating user successfully created
		res.json({ token: tokenForUser(user)});

	});	

};