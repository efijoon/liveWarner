const mongoose= require('mongoose');
const Schema = mongoose.Schema;

const namadSchema = Schema({
    user: { type: Schema.Types.ObjectId, required: true },
    symbolID: { type: String, required: true },
    symbolName: { type: String, required: true },
    comparefield: { type: String, required: true },
    compareNumber: { type: Number, required: true },
    comparator: { type: String, required: true },
    warningName: { type: String, required: true },
    sent: { type: Boolean, default: false },
});

module.exports = mongoose.model('Warning' , namadSchema);