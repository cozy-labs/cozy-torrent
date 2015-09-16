
var Dl = require('../models/dl')
var deamon = require('../../daemon')

module.exports.fetch = function (req, res) {
    Dl.all(function (error, data) {
        if (error !== null || undefined) {
            res.status(500).send()
        }
        res.status(200).send(data)
    })
}

module.exports.create = function (req, res) {
    var engine = deamon.newDownload(req.body.magnet)
    res.status(200).send(engine)

        //var stream = file.createReadStream()
}
