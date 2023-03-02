const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter categoryname"],
  },
  color: {
    type: String,
  },
  icon: {
    type: String,
  },
});

module.exports = mongoose.model("Category", categorySchema);
