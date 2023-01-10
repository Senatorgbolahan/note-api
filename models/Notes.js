const mongoose = require('mongoose')


const NoteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "please provide the title"],
        maxLength: 50
    },
    description: {
        type: String,
        required: [true, "please provide the description"],
        maxLength: 100
    },
    author: {
        type: String,
        required: [true, "Enter the name of the author"],
        maxLength: 100
    },
    status: {
        type: String,
        enum: ["published", "released", "pending"],
        default: "pending",
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: [true, "please provide user"],
    }
}, { timestamps: true })

module.exports = mongoose.model("Note", NoteSchema)