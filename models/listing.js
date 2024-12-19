const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listeningSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    filename: String,
    url: String,
  },
  price: String,
  location: String,
  country: String,
});

const Listing = mongoose.model("Listing", listeningSchema);
module.exports = Listing;
