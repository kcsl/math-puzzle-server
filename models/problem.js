const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const problemSchema = new Schema({
  title: String,
  topic: String,
  sections: Number,
  createdAt: String,
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "Admin",
  },
  author: String,
});

const Problem = mongoose.model("Problem", problemSchema);

module.exports = Problem;
