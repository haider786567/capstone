import { Router } from "express";
import passport from "passport";
import User from "../models/user.model.js";
import { sendAuthNotification } from "../config/mq.js";
const router = Router();

router.get('/google', passport.authenticate('google', { 
    session: false,
    scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/',session:false }), async (req, res) => {
    try {
        const { id, displayName, emails,photos } = req.user;
        
        
        

        let user = await User.findOne({ googleId: id });
        console.log(user);

        await sendAuthNotification({ 
            userId: user._id,
            action:'google_login',
            timestamp: new Date(),
            emails: emails[0].value
         });
        
        if (!user) {
            user = new User({ googleId: id, name: displayName, email: emails[0].value, avatar: photos[0].value });
            await user.save();
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true});
        res.redirect('/');
    } catch (err) {
        console.error('Error during authentication callback:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;