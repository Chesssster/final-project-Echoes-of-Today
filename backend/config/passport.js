const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const Sequence = require('../models/Sequence');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/users/google/callback',
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await User.findOne({ email: profile.emails[0].value });
        
        if (user) {
          // User exists, return user
          return done(null, user);
        }
        
        // Create new user with Google profile data
        const sequenceDocument = await Sequence.findOneAndUpdate(
          { _id: 'userid' },
          { $inc: { sequence_value: 1 } },
          { new: true, upsert: true }
        );
        
        user = new User({
          _id: sequenceDocument.sequence_value,
          name: profile.displayName,
          email: profile.emails[0].value,
          // No password for OAuth users
          googleId: profile.id,
          role: 'user'
        });
        
        await user.save();
        done(null, user);
      } catch (err) {
        console.error('Error in Google strategy:', err);
        done(err, null);
      }
    }
  )
);

module.exports = passport; 