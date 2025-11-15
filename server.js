const express = require("express");
const cors = require("cors");
const multer = require("multer");
const Joi = require("joi"); //download this package for data validation
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./public/images/");
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });
  
  const upload = multer({ storage: storage });


let volunteers =
[
	{
		"id": "indv-vol",
		"image": "IndvVol.webp",
		"title": "Volunteer Individually",
		"description": "Take part in one-off or recurring volunteer opportunities that fit your schedule.",
		"link": "/volunteer/individual",
		"cta": "Volunteer"
	},
	{
		"id": "animal-shelter",
		"image": "AnimalShelter.webp",
		"title": "Animal Shelter Support",
		"description": "Help care for animals and support shelter operations.",
		"link": "/volunteer/animal-shelter",
		"cta": "Learn More"
	},
	{
		"id": "park-cleanup",
		"image": "ParkCleanUp.webp",
		"title": "Park Clean-Up",
		"description": "Join a group to clean up and restore local parks and trails.",
		"link": "/volunteer/park-cleanup",
		"cta": "Sign Up"
	},
	{
		"id": "soup-kitchen",
		"image": "/SoupKitchen.webp",
		"title": "Soup Kitchen",
		"description": "Assist with meal prep and distribution for those in need.",
		"link": "/volunteer/soup-kitchen",
		"cta": "Join"
	},
	{
		"id": "highway-cleanup",
		"image": "HighwayCleanup.webp",
		"title": "Highway Clean-Up",
		"description": "Help keep roadsides safe and clean with organized crews.",
		"link": "/volunteer/highway-cleanup",
		"cta": "Participate"
	}
]

app.get("/api/volunteers/", (req, res)=>{ //this is the get request, make sure you put this in your front end 
    console.log("in get request");
    res.send(volunteers);
});

app.get("/api/volunteers/:id", (req, res)=>{ 
    const volunteer = volunteers.find((volunteer)=> volunteer.id === req.params.id);
    res.send(volunteer);
});

app.post("/api/volunteers", upload.single("img"), (req,res)=>{
	console.log("in post request");
	const result = validateVolunteer(req.body);

	if(result.error){
		console.log("There is an error");
		res.status(400).send(result.error.details[0].message);
		return;
	}
	const Volunteer = {
		//  _id: houses.length,
        // name:req.body.name,
        // size:req.body.size,
        // bedrooms:req.body.bedrooms,
        // bathrooms:req.body.bathrooms,

		id: Date.now().toString(),
		title: req.body.title,
		description: req.body.description,
		link: req.body.link,
	};

	//adding image
	if(req.file){
		Volunteer.image = req.file.filename;
	}

	volunteers.push(Volunteer);
	res.status(200).send(Volunteer);
});

const validateVolunteer = (house) => {
	const schema = Joi.object({
		_id: Joi.allow(""),
		title: Joi.string().min(1).required(),
		description: Joi.string().min(1).required(),
		link: Joi.string().min(1).required(),
	});
	return schema.validate(house);
}


app.listen(3001, () => {
  console.log("Server is running on port 3001");
});