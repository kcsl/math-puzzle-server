const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const partSchema = new Schema({
  question: String,
  answer: String,
  index: Number,
  ProblemID: {
    type: Schema.Types.ObjectId,
    ref: "Problem",
  },
});

const Part = mongoose.model("Part", partSchema);

module.exports = Part;