import passport from "passport";
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { configDotenv } from "dotenv";
configDotenv()
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_REDIRECT_URI,
            scope: ['profile', 'email']
        },
        (accessToken , refreshToken, profile, done)=>{
            const userData = {
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails?.[0].value,
                picture: profile.photos?.[0].value,
            }
            return done(null, userData);
        }
    )
);

passport.serializeUser((user,done)=>done(null,user));
passport.deserializeUser((user,done)=>done(null,user));

export default passport;
