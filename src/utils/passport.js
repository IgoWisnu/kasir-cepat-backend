const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('../models');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'dummy_id',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy_secret',
    callbackURL: "/api/auth/google/callback"
  },
  async function(accessToken, refreshToken, profile, cb) {
      try {
          const email = profile.emails[0].value;
          let user = await db.User.findOne({ where: { email } });

          if (!user) {
              // Create user if not found
              user = await db.User.create({
                  username: profile.displayName,
                  email: email,
                  auth_provider: 'google',
                  google_id: profile.id,
                  is_verified: true
              });
          } else {
              // Update google_id if missing but email exists and auth_provider is google?
              if (!user.google_id) {
                  user.google_id = profile.id;
                  user.auth_provider = 'google';
                  user.is_verified = true;
                  await user.save();
              }
          }
          
          return cb(null, user);
      } catch (err) {
          return cb(err, null);
      }
  }
));

module.exports = passport;
