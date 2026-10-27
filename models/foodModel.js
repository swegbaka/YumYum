const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  foodName: {
    type: String,
    required: [true, "A food must have a name"],
  },
  Link: {
    type: String,
    required: [true, "A food must have a link"],
    unique: true,
  },
  link1: {
    type: String,
    required: [true, "A food must have a link"],
    unique: true,
  },
  emoji: {
    type: String,
  },
});

const Food = mongoose.model("Beef", foodSchema);

module.exports = Food;
