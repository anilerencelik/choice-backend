import db from 'db'

const middlewareFunc = (req, res, next) => {
    db.query(`USE ${req.tokenData.APIKEY};`, (err, results) => {
        if (err) {
            return res.json({ status: false, message: "Invalid Token" });
        } else {
            next();
        }
    })
};


export default middlewareFunc