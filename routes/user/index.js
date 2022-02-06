import express from 'express';
import { ObjectId } from "mongodb";

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { uid } = req.headers;
        const db = req.app.locals.db
        const checkUser = await db.collection('userData').findOne(ObjectId(uid))
        if (checkUser === null) return res.status(401).json({ error: "Kayıtlı kullanıcı bulunamadı." });
        const responseUser = await db.collection('user').findOne(ObjectId(uid))
        res.json(responseUser)
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
})

router.post('/', async (req, res) => {
    try {
        const { uid, votedPosts, ownPosts, blockedUsers } = req.body;
        const db = req.app.locals.db
        const checkUser = await db.collection('userData').findOne(ObjectId(uid))
        if (checkUser === null) return res.status(401).json({ error: "Kayıtlı kullanıcı bulunamadı." });
        const responseUser = await db.collection('user').insertOne({ '_id': uid, votedPosts, ownPosts, blockedUsers })
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
})


router.get('/votedPosts', async (req, res) => {
    try {
        res.send("TODO")
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
})


router.get('/ownPosts', async (req, res) => {
    try {
        res.send("TODO")
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
})


router.get('/blockedUsers', async (req, res) => {
    try {
        res.send("TODO")
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
})

export default router;