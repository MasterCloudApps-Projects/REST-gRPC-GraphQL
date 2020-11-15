var mongoose = require('mongoose');
const Client = require('../models/client');
var { CastError } = mongoose.Error;

module.exports = async (req, res) => {
    if (!req.user) {
        res.sendStatus(401);
        return;
    }
    try {
        const clientFetched = await Client.findOne({dni: req.params.dni});
        if (clientFetched) {
            res.format({
                'application/json': () => res.json({
                    dni: clientFetched.dni,
                    iban: clientFetched.iban
                })
            });
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        if (error instanceof CastError) {
            res.sendStatus(400);
        } else {
            console.log(error);
            res.sendStatus(500);
        }
    }
}
