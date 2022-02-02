import express from 'express';
import { ObjectId } from "mongodb";

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { uid } = req.headers
        const db = req.app.locals.db
        const getMessages = await db.collection('message').find({
            "$or": [{
                "senderID": ObjectId(uid)
            }, {
                "ownerID": ObjectId(uid)
            }]
        }).toArray()
        const temp = await db.collection('message').findOne({ ownerID: ObjectId(uid) })

        console.log(temp)
        res.json(getMessages)
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
})


router.post('/send-message', async (req, res) => {
    try {
        const { uid, message, postID, senderID } = req.body
        const db = req.app.locals.db
        if (!uid) {
            const newMessageObject = await db.collection('message').insertOne({
                createdAt: Date(),
                updatedAt: Date(),
                isDeleted: false,
                postID: ObjectId(postID),
                senderID: ObjectId(senderID),
                ownerID: ObjectId(ownerUserID.userID),
                messages: [{ isOwner: 0, timestamp: Date(), message: message }]
            })
            res.json(newMessageObject)
        } else {
            const getMessage = await db.collection('message').findOne(ObjectId(uid))
            if (getMessage.ownerID.equals(ObjectId(senderID))) {
                getMessage.messages.push({
                    isOwner: 1, timestamp: Date(), message: message
                })
            } else {
                getMessage.messages.push({
                    isOwner: 0, timestamp: Date(), message: message
                })
            }
            const response = await db.collection('message').updateOne(
                { "_id": ObjectId(uid) },
                {
                    $set: { messages: getMessage.messages }
                }
            )
            res.json(response)
        }
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
})

export default router;