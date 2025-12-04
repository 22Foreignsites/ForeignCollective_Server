const express = require("express");
const cors = require("cors");
const multer = require("multer");
const Joi = require("joi"); //download this package for data validation
const mongoose = require("mongoose");
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


// let volunteers =
// [
// 	{
// 		"id": "indv-vol",
// 		"image": "IndvVol.webp",
// 		"title": "Volunteer Individually",
// 		"description": "Take part in one-off or recurring volunteer opportunities that fit your schedule.",
// 		"link": "/volunteer/individual",
// 		"cta": "Volunteer"
// 	},
// 	{
// 		"id": "animal-shelter",
// 		"image": "AnimalShelter.webp",
// 		"title": "Animal Shelter Support",
// 		"description": "Help care for animals and support shelter operations.",
// 		"link": "/volunteer/animal-shelter",
// 		"cta": "Learn More"
// 	},
// 	{
// 		"id": "park-cleanup",
// 		"image": "ParkCleanUp.webp",
// 		"title": "Park Clean-Up",
// 		"description": "Join a group to clean up and restore local parks and trails.",
// 		"link": "/volunteer/park-cleanup",
// 		"cta": "Sign Up"
// 	},
// 	{
// 		"id": "soup-kitchen",
// 		"image": "/SoupKitchen.webp",
// 		"title": "Soup Kitchen",
// 		"description": "Assist with meal prep and distribution for those in need.",
// 		"link": "/volunteer/soup-kitchen",
// 		"cta": "Join"
// 	},
// 	{
// 		"id": "highway-cleanup",
// 		"image": "HighwayCleanup.webp",
// 		"title": "Highway Clean-Up",
// 		"description": "Help keep roadsides safe and clean with organized crews.",
// 		"link": "/volunteer/highway-cleanup",
// 		"cta": "Participate"
// 	}
// ]

mongoose
  .connect("mongodb+srv://fredpearsoniv_db_user:Fredf00tball$@foreigncollective.uzftm8h.mongodb.net/")
  .then(() => console.log("Connected to mongodb..."))
  .catch((err) => console.error("could not connect ot mongodb...", err));

  const volunteerSchema = new mongoose.Schema({
	title: String,
	description: String,
	link: String,
	image: String,
  });

  volunteerSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

  const Volunteer = mongoose.model("Volunteer", volunteerSchema);

app.get("/api/volunteers/", async (req, res)=>{ //this is the get request, make sure you put this in your front end 
	const volunteers = await Volunteer.find();
    res.send(volunteers);
});

// app.get("/api/volunteers/:id", (req, res)=>{ 
//     const volunteer = volunteers.find((volunteer)=> volunteer.id === req.params.id);
//     res.send(volunteer);
// });

app.post("/api/volunteers", upload.single("img"), async (req,res)=>{
	console.log("in post request");
	const result = validateVolunteer(req.body);


	if(result.error){
		console.log("There is an error");
		res.status(400).send(result.error.details[0].message);
		return;
	}
	const volunteer = new Volunteer({
		//  _id: houses.length,
        // name:req.body.name,
        // size:req.body.size,
        // bedrooms:req.body.bedrooms,
        // bathrooms:req.body.bathrooms,

		// id: Date.now().toString(),
		title: req.body.title,
		description: req.body.description,
		link: req.body.link,

	});

	//adding image
	if(req.file){
		volunteer.image = req.file.filename;
	}

	const newVolunteer = await volunteer.save();
	res.status(200).send(newVolunteer);
});




app.put("/api/volunteers/:id", upload.single("img"), async (req, res)=>{
    //console.log(`You are trying to edit ${req.params.id}`);
    //console.log(req.body);

    // const volunteer = volunteers.find((v)=>v.id===req.params.id);

    //  if(!volunteer) {
    //     res.status(404).send("The volunteer you wanted to edit is unavailable");
    //     return;
    // }

    const isValidUpdate = validateVolunteer(req.body);

    if(isValidUpdate.error){
        console.log("Invalid Info");
        res.status(400).send(isValidUpdate.error.details[0].message);
        return;
	}
	


	const fieldsToUpdate ={
		description: req.body.description,
		title: req.body.title,
		link: req.body.link,
	};

	if(req.file){
        fieldsToUpdate.image = req.file.filename;
    }

	const success = await Volunteer.updateOne({_id: req.params.id}, fieldsToUpdate);

	if(!success) {
		res.status(404).send("The volunteer you wanted to edit is unavailable");
		return;
	}



	const volunteer = await Volunteer.findById(req.params.id);
    res.status(200).send(volunteer);

});

app.delete("/api/volunteers/:id", async (req,res)=>{
    const volunteer = await Volunteer.findByIdAndDelete(req.params.id);

    if(!volunteer) {
        res.status(404).send("The volunteer you wanted to delete is unavailable");
        return;
    }

    // const index = volunteers.indexOf(volunteer);
    // volunteers.splice(index, 1);
    res.status(200).send(volunteer);
});





const validateVolunteer = (volunteer) => {
	const schema = Joi.object({
		_id: Joi.allow(""),
		title: Joi.string().min(1).required(),
		description: Joi.string().min(1).required(),
		link: Joi.string().min(1).required(),
	});
	return schema.validate(volunteer);
}


app.listen(3001, () => {
  console.log("Server is running on port 3001");
});