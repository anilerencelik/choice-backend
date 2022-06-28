import express from 'express';
import multer, { diskStorage } from 'multer';
import { ObjectId } from "mongodb";

const BASE_URL = '/uploads/'
const BASE_ADDER = (str) => {
    return BASE_URL + str.filename
}
const ENDPOINT_ADDER = (arr) => {
    return arr.map(medias => process.env.ENDPOINT_URL + medias)
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
        const { category } = req.query
        const { uid, mediacount, limit } = req.headers
        let searchParams = {}
        if (uid) searchParams["userID"] = ObjectId(uid)
        if (category) searchParams["category"] = category
        if (mediacount) searchParams['mediaCount'] = Number(mediacount)
        const db = req.app.locals.db
        console.log(searchParams)
        const response = await db.collection('post').aggregate([{
            $match: searchParams
        },
        {
            $lookup:
            {
                from: 'userData',
                localField: 'userID',
                foreignField: '_id',
                as: 'userdetails'
            }
        }
        ]).limit(limit ? parseInt(limit, 10) : 99999).toArray()
        const tempArray = response.map((e, i) => ({ ...e, medias: ENDPOINT_ADDER(e.medias) }));
        const newArray = tempArray.map((e, i) => ({ ...e, userPicture: ENDPOINT_ADDER([e.userdetails[0].picture]) }));
        res.json(newArray)
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
})

router.post('/', upload.any('post'), async (req, res) => {
    try {
        let mediaType = req.files.length
        const { uid, description, category, detail0, detail1, detail2, detail3 } = req.body
        let medias = req.files.map(BASE_ADDER)
        const db = req.app.locals.db
        let votes = {}
        let votedUsers = {}
        let detail = [detail0, detail1, detail2, detail3]
        for (let i = 0; i < mediaType; i++) {
            votes[i] = 0
            votedUsers[i] = []
        }
        const response = await db.collection('post').insertOne({
            createdAt: Date(),
            updatedAt: Date(),
            isDeleted: false,
            mediaCount: mediaType,
            medias: medias,
            userID: ObjectId(uid),
            votedUsers,
            votes,
            description,
            category,
            detail
        })
        res.json(response)
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
})

router.post('/vote', async (req, res) => {
    try {
        const { uid, postIndex, postId } = req.body
        const db = req.app.locals.db
        // ILGILI POST ÇEKILDI
        const y = await db.collection('post').findOne(
            { '_id': ObjectId(postId) }
        )

        // OY VERDIYSE HANGI POSTA VERMEDIYSE -1 
        let fIndex = -1
        for (let key in y.votedUsers) {
            let a = y.votedUsers[parseInt(key)].find(element => element.toString() == ObjectId(uid).toString())
            if (a != undefined) {
                fIndex = parseInt(key)
            }
        }
        if (fIndex == -1) {
            // VOTED USER EKLEME 
            y.votedUsers[parseInt(postIndex)].push(ObjectId(uid))
            // OY ARTIRMA
            y.votes[parseInt(postIndex)] += 1
        } else {
            // AYNI YERE MI VERDI
            if (fIndex != parseInt(postIndex)) {
                // VOTED USER KALDIRMA
                y.votedUsers[(parseInt(fIndex))] = y.votedUsers[(parseInt(fIndex))].filter(element => element.toString() != ObjectId(uid).toString())
                // OY AZALTMA
                y.votes[parseInt(fIndex)] -= 1
                // VOTED USER EKLEME
                y.votedUsers[parseInt(postIndex)].push(ObjectId(uid))
                // OY ARTIRMA
                y.votes[parseInt(postIndex)] += 1
            }
        }
        await db.collection('post').updateOne({ '_id': ObjectId(postId) }, { $set: { votedUsers: y.votedUsers, votes: y.votes } })
        res.json(y)
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
})




export default router;