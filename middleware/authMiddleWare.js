import db from 'db'

const change2Uzders = (req, res, next) => {
    db.query("USE Uzders;", (err, results) => {     
        next()        
    })
}

export default change2Uzders