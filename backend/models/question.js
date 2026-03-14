const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    text: {
        type:String,
        required: true
    },
    type: {
        type:String,
        enum: ['HR','Tech'],
        required: true
    },
    difficulty: {
        type:String,
        enum: ['easy','medium','hard'],
        required:true
    },
    source: { type: String, enum: ["DB", "AI"], default: "AI" },
     topic: { type: String, required: true }, // ✅ STRING now
    keywords:[{type:String}],
},{timestamps:true});

module.exports = mongoose.model('question',questionSchema);