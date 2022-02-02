import express from 'express';
import multer, { diskStorage } from 'multer';
import { ObjectId } from "mongodb";

const BASE_URL = 'http://localhost:5000/uploads/'
const BASE_ADDER = (str) => {
    return BASE_URL + str.filename
}

const storage = diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
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
        const { uid, mediacount } = req.headers
        let searchParams = {}
        if (uid) searchParams["userID"] = ObjectId(uid)
        if (mediacount) searchParams['mediaCount'] = Number(mediacount)
        console.log(searchParams)
        const db = req.app.locals.db
        const response = await db.collection('post').find(searchParams).limit(10).toArray()
        res.json(response)
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
})

router.post('/', upload.any('post'), async (req, res) => {
    try {
        let mediaType = req.files.length
        const { uid, description } = req.body
        let medias = req.files.map(BASE_ADDER)
        const db = req.app.locals.db
        const response = await db.collection('post').insertOne({
            createdAt: Date(),
            updatedAt: Date(),
            isDeleted: false,
            mediaCount: mediaType,
            medias: medias,
            userID: ObjectId(uid),
            votedUsers: {},
            votes: {},
            description
        })
        res.json(response)
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
})

export default router;