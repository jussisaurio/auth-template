// The purpose of passport is to check if user is logged in before they hit protected controllers
// Passport is an ecosystem of 'strategies' for verifying user authentication
// Here we get a JWT verification strategy.

const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

// Create local strategy for signing in with email&PW (not authing with JWT)
const localOptions = { usernameField: 'email'}; // passport-local expects a username field by default, so redefine
const localLogin = new LocalStrategy(localOptions, function(email, password, done){

	// Verify email and pword, call done with the user if OK
	User.findOne({email: email}, function(err, user){
		if (err) { return done(err);}
		if (!user) {return done(null, false);} // no error, but no user found

		// compare passwords: is 'password' === user.password?
		user.comparePW(password, function(err, match){
			if (err) return done(err);

			if (!match) return done(null, false); // no error, but not a match

			return done(null, user); // correct pw! passport assigns this object to req.user
		});

	});
	// Otherwise, call done with false
});




// Set up options for JWT strategy
const jwtOptions = {
	jwtFromRequest: ExtractJwt.fromHeader('authorization'),
	secretOrKey: config.secret
};

// Create JWT Strategy. Payload = decoded JWT, see sub&iat in authentication.js
// Its callback also gets a function argument called done
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done){

	// See if user ID in payload exists in DB
	User.findById(payload.sub, function(err,user){
		if (err) return done(err, false); // false, because we didn't find a user object

		if (user) done (null, user); // null because no error, user = user that was found with this ID
		else done (null, false); // null because no error, false because no user found
	});

});

// Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);