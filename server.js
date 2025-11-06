const express = require("express");
const cors = require("cors");
const multer = require("multer");
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

let houses =
[
	{
		"id": "indv-vol",
		"image": "../src/ImgGallery/IndvVol.webp",
		"title": "Volunteer Individually",
		"description": "Take part in one-off or recurring volunteer opportunities that fit your schedule.",
		"link": "/volunteer/individual",
		"cta": "Volunteer"
	},
	{
		"id": "animal-shelter",
		"image": "../src/ImgGallery/AnimalShelter.webp",
		"title": "Animal Shelter Support",
		"description": "Help care for animals and support shelter operations.",
		"link": "/volunteer/animal-shelter",
		"cta": "Learn More"
	},
	{
		"id": "park-cleanup",
		"image": "../src/ImgGallery/ParkCleanUp.webp",
		"title": "Park Clean-Up",
		"description": "Join a group to clean up and restore local parks and trails.",
		"link": "/volunteer/park-cleanup",
		"cta": "Sign Up"
	},
	{
		"id": "soup-kitchen",
		"image": "../src/ImgGallery/SoupKitchen.webp",
		"title": "Soup Kitchen",
		"description": "Assist with meal prep and distribution for those in need.",
		"link": "/volunteer/soup-kitchen",
		"cta": "Join"
	},
	{
		"id": "highway-cleanup",
		"image": "../src/ImgGallery/HighwayCleanup.webp",
		"title": "Highway Clean-Up",
		"description": "Help keep roadsides safe and clean with organized crews.",
		"link": "/volunteer/highway-cleanup",
		"cta": "Participate"
	}
]

app.get("/api/houses/", (req, res)=>{ //this is the get request, make sure you put this in your front end 
    console.log("in get request");
    res.send(houses);
});

app.get("/api/houses/:id", (req, res)=>{ 
    const house = houses.find((house)=> house._id === parseInt(req.params.id));
    res.send(houses);
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});