const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LeaderSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  abbr: {
    type: String,
    required: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
});

const Leaders = mongoose.model("Leader", LeaderSchema);

module.exports = Leaders;
