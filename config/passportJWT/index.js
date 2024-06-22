//Setup Passport-JWT
const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
const passport = require("passport");
const dotenv = require("dotenv");
const User = require("../../models/User");

dotenv.config();

function setupPassport() {
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = process.env.JWT_ACCESS_KEY;
  //   opts.issuer = "accounts.examplesoft.com";
  //   opts.audience = "yoursite.net";
  passport.use(
    new JwtStrategy(opts, function (jwt_payload, done) {
      User.findOne({ id: jwt_payload.sub })
        .then((user) => {
          if (user) {
            //return with no error and user data
            return done(null, user);
          } else {
            return done(null, false);
            // or you could create a new account
          }
        })
        .catch((err) => {
          if (err) {
            //done(error, doesUserExist)
            return done(err, false);
          }
        });
    })
  );
}

module.exports = {
  setupPassport,
};
