import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import authRoutes from './routes/auth.routes.js';
import cookies from 'cookie-parser';



const app = express();
app.use(morgan('dev'));

app.use(express.json());
app.use(cookies());
app.use(passport.initialize());

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
    // In a real app, you'd save the user to your database here
    return done(null,profile);
}));


app.get('/_status/healthz', (req, res) => {
    res.status(200).json({ status: 'ok' });
});
app.get('/_status/readyz', (req, res) => {
    res.status(200).json({ status: 'ready' });
});

app.use('/api/auth', authRoutes);

export default app