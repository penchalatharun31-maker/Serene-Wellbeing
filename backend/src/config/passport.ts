import passport from 'passport';
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import User from '../models/User';
import Expert from '../models/Expert';
import logger from '../utils/logger';

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_CALLBACK_URL) {
  logger.error('Google OAuth credentials not configured. Please set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_CALLBACK_URL.');
  // Don't fail in development to allow testing without OAuth
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Google OAuth credentials required in production');
  }
}

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || '';

// Serialize user for the session
passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

// Deserialize user from the session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },
    async (req: any, accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
      try {
        // Extract user info from Google profile
        const email = profile.emails?.[0]?.value;
        const name = profile.displayName;
        const googleId = profile.id;
        const profilePhoto = profile.photos?.[0]?.value;

        if (!email) {
          return done(new Error('No email found in Google profile'), undefined);
        }

        // Check if user already exists
        let user = await User.findOne({ email });

        if (user) {
          // User exists - update Google ID if not set
          if (!user.googleId) {
            user.googleId = googleId;
            user.profilePhoto = user.profilePhoto || profilePhoto;
            await user.save();
          }

          logger.info(`User logged in via Google: ${email}`);
          return done(null, user);
        }

        // Get role from session/query (set by frontend)
        const role = req.session?.oauthRole || 'user';

        // Create new user
        user = await User.create({
          name,
          email,
          googleId,
          profilePhoto,
          role,
          isEmailVerified: true, // Google emails are verified
          country: 'India',
          currency: 'INR',
        });

        // If role is expert, create expert profile
        if (role === 'expert') {
          await Expert.create({
            userId: user._id,
            title: 'Wellness Expert',
            specialization: [],
            bio: '',
            experience: 0,
            hourlyRate: 100,
            currency: 'INR',
            country: 'India',
            isApproved: false,
            approvalStatus: 'pending',
          });
        }

        logger.info(`New user registered via Google: ${email}`);
        return done(null, user);
      } catch (error: any) {
        logger.error('Google OAuth error:', error);
        return done(error, undefined);
      }
    }
  )
);

export default passport;
