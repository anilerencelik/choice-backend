import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import jwtTokens from '../../utils/jwt-helpers';

const router = express.Router();

router.post('/login', async (req, res) => {
    // try {
    //     const { email, password } = req.body;
    //     // email 
    //     const db = req.app.locals.db
    //     const checkUser = await db.collection('userData').findOne({ "email": email })
    //     if (checkUser === null) return res.status(401).json({ error: "Kayıtlı kullanıcı bulunamadı." });
    //     //PASSWORD CHECK
    //     const validPassword = await bcrypt.compare(password, checkUser.password);
    //     if (!validPassword) return res.status(401).json({ error: "Incorrect password" });
    //     //JWT
    //     let tokens = jwtTokens(checkUser);
    //     res.json(tokens);
    // } catch (error) {
    //     res.status(401).json({ error: error.message });
    // }
    try {
        const { email, password } = req.body;
        // email 
        const db = req.app.locals.db
        const checkUser = await db.collection('userData').findOne({ "email": email })
        if (checkUser === null) return res.status(401).json({ error: "Kayıtlı kullanıcı bulunamadı." });
        //PASSWORD CHECK
        const validPassword = await bcrypt.compare(password, checkUser.password);
        if (!validPassword) return res.status(401).json({ error: "Incorrect password" });
        //JWT
        res.json({ userID: checkUser._id });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

router.post('/sign-up', async (req, res) => {
    try {
        const { email, password, username } = req.body;
        const db = req.app.locals.db
        // email, username
        const checkUser = await db.collection('userData').findOne({
            "$or": [{
                "username": username
            }, {
                "email": email
            }]
        })
        if (checkUser !== null) return res.status(401).json({ error: "Kayıtlı kullanıcı bulundu." });
        // PASSWORD CHECK 



        // TOKEN
        const hashedPass = await bcrypt.hash(password, 12)
        const response = await db.collection('userData').insertOne({
            password: hashedPass,
            username,
            email,
            createdAt: Date(),
            updatedAt: Date(),
            isDeleted: false
        })
        res.json(response)
        /*
        const users = await pool.query('SELECT * FROM users WHERE user_email = $1', [email]);
        if (users.rows.length === 0) return res.status(401).json({ error: "Email is incorrect" });
        //PASSWORD CHECK
        const validPassword = await bcrypt.compare(password, users.rows[0].user_password);
        if (!validPassword) return res.status(401).json({ error: "Incorrect password" });
        //JWT
        let tokens = jwtTokens(users.rows[0]);//Gets access and refresh tokens
        res.cookie('refresh_token', tokens.refreshToken, { ...(process.env.COOKIE_DOMAIN && { domain: process.env.COOKIE_DOMAIN }), httpOnly: true, sameSite: 'none', secure: true });
        res.json(tokens);
        */
    } catch (error) {
        res.status(401).json({ error: error.message });
    }

});

router.get('/refresh_token', (req, res) => {
    try {
        const refreshToken = req.cookies.refresh_token;
        if (refreshToken === null) return res.sendStatus(401);
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, user) => {
            if (error) return res.status(403).json({ error: error.message });
            let tokens = jwtTokens(user);
            res.cookie('refresh_token', tokens.refreshToken, { ...(process.env.COOKIE_DOMAIN && { domain: process.env.COOKIE_DOMAIN }), httpOnly: true, sameSite: 'none', secure: true });
            return res.json(tokens);
        });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

router.delete('/refresh_token', (req, res) => {
    try {
        res.clearCookie('refresh_token');
        return res.status(200).json({ message: 'Refresh token deleted.' });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

router.get('/selambebek', (req, res) => {
    try {
        res.send("aleykümselam")
    } catch (error) {
        res.status(401).json({ error: error.message });
    }

})


export default router;