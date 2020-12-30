const mongoose= require('mongoose');
const momentJalaali = require('moment-jalaali');

const Schema = mongoose.Schema;

const namadSchema = Schema({
    index: { type: Number, required: true },
    user: { type: Schema.Types.ObjectId, required: true },
    symbolID: { type: String, required: true },
    symbolName: { type: String, required: true },
    compareField: { type: String, required: true },
    compareNumber: { type: Number, required: true },
    comparator: { type: String, required: true },
    warningName: { type: String, required: true },
    sent: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Warning' , namadSchema);