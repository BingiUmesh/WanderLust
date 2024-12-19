const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const sampleListing= require("./data");
const Listing = require("../models/listing");

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

main()
  .then(() => {
    console.log("connection succesfull");
  })
  .catch((err) => {
    console.log(err);
  });

const initDB=async()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(sampleListing.data);
    console.log("data was initialized");
}

initDB();