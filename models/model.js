const mongoose = require("mongoose")
const msgSchema = new mongoose.Schema({
    msg: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    recipient: {
        type: String,
        required: true
    },
})
const sc = mongoose.model("msg", msgSchema)
module.exports = sc