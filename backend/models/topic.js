// models/topic.js
const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // Cyber Security
  slug: { type: String, required: true, unique: true }, // cyber-security
  category: { type: String }, // TECH / HR
  active: { type: Boolean, default: true },
});

module.exports = mongoose.model("Topic", topicSchema);
