import express from 'express';
import { ObjectId } from "mongodb";
import multer, { diskStorage } from 'multer';

const BASE_URL = '/uploads/pp/'
const BASE_ADDER = (str) => {
    return BASE_URL + str.filename
}
const ENDPOINT_ADDER = (arr) => {
    return arr.map(medias => process.env.ENDPOINT_URL + medias)
}


const storage = diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/pp/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now())
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 20 },
    fileFilter: fileFilter
});

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



router.post('/profile-picture', upload.any('post'), async (req, res) => {
    try {
        const { uid } = req.body
        console.log(5, uid)
        let medias = req.files.map(BASE_ADDER)
        const db = req.app.locals.db
        console.log(medias[0])
        await db.collection('userData').updateOne({ '_id': ObjectId(uid) },
            { '$set': { 'picture': medias[0] } })
        res.json('OK')
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
})

export default router;