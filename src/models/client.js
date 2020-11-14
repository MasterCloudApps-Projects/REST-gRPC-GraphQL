const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const clientSchema = new Schema(
    {
        dni: {
            type: String,
            required: true,
        },
        iban: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Client', clientSchema);
