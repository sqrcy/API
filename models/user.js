const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    userId: {
        type: Number,
        required: true
    },
    miles: {
        type: Number,
        required: true,
        default: 0
    }
})

module.exports = mongoose.model('User', userSchema)
