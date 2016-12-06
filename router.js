const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');

// session false because by default passport tries to make a cookie based session
// these passport middlewares are called first before they are given token
const requireAuth = passport.authenticate('jwt', { session: false});
const requireSignin = passport.authenticate('local', { session: false});

module.exports = function(app) {

	app.get('/', requireAuth, function(req,res) {
		res.send({ hi: 'there'});
	});

	app.post('/signup', Authentication.signup);

	app.post('/signin', requireSignin, Authentication.signin);

};