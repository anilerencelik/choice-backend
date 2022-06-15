import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import Routes from './routes';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config()


const app = express();
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 1000000 }));
//app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
//app.use(express.static(__dirname + '/public'));
app.use('/uploads', express.static('uploads'));

app.use(cors())


MongoClient.connect(process.env.MONGODB_URL, { promiseLibrary: Promise }, (err, db) => {
    if (err) {
        console.log(`Failed to connect to the database. ${err.stack}`);
    }
    app.locals.db = db.db(process.env.MONGOBD_DBNAME);

    Routes(app)

    app.get('/', (req, res) => {
        res.send("Welcome to Node Babel")
    })

    app.listen(5001, () => {
        console.log(`Node.js app is listening at http://localhost:5000`);
    });
});