const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate")

app.engine('ejs', ejsMate);

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))

app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname,"public/css")))
app.use(express.static(path.join(__dirname,"public/js")))

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

app.listen(8080, () => {
  console.log("server running at port 8080");
});

app.get("/", (req, res) => {
  res.send("Hi Iam a root");
});

//Index Route
app.get("/listings", async (req, res) => {
  try {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
  } catch (err) {
    console.log(err);
    res.send("ERROR: Unable to fetch listings.");
  }
});

//new route
app.get("/listings/new",(req,res)=>{
  res.render("listings/new"); 
})

//Show Route
app.get("/listings/:id", async (req, res) => {
  const { id } = req.params; // Get the ID directly
  try {
    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).send("Listing not found");
    }
    res.render("listings/show", { listing });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

//create route
app.post("/listings",(req,res)=>{
  // let{title,description,image,price,country,location}=req.body;
  const newListing=new Listing(req.body)
  newListing.save();
  res.redirect("/listings")
})

//edit route
app.get("/listings/:id/edit",async(req,res)=>{
  let{id}=req.params;
  try {
    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).send("Listing not found");
    }
    else{
      res.render("listings/edit", { listing });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }

})

//update route
app.put("/listings/:id",async(req,res)=>{
  let {id}=req.params;
  await Listing.findByIdAndUpdate(id,{...req.body});
  res.redirect(`/listings/${id}`)
})

//delete route
app.delete("/listings/:id",async(req,res)=>{
  let {id}=req.params;
  let deletedData=await Listing.findByIdAndDelete(id);
  console.log(deletedData)
  res.redirect("/listings")
})