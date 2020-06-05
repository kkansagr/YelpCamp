var express = require("express");
var router = express.Router();
var Campground = require("../models/campgrounds");
var middleware = require("../middleware/index.js");

router.get("/", function(req,res){
	
	Campground.find({},function(err,allcampgrounds){
		if(err){
			console.log(err);
		}
		else{
			res.render("campgrounds/index",{campgrounds:allcampgrounds, currentUser: req.user});
		}
	});
	// res.render("campgrounds",{campgrounds:campgrounds});
});

router.post("/",middleware.isLoggedIn,function(req,res){
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCampground = {name:name, price:price, image:image, description:desc, author:author}
	Campground.create(newCampground,function(err,newlycreated){
		if(err){
			console.log(err);
		}else{
			res.redirect("/campgrounds");
		}
	});
});

router.get("/new", middleware.isLoggedIn,function(req,res){
	res.render("campgrounds/new");
});

// SHOW EVERYTHING
router.get("/:id", function(req,res){
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/show",{campground:foundCampground});
		}
	});
	// res.render("show");
});


// EDIT campgrounds route
router.get("/:id/edit",middleware.checkCampgroundOwnership, function(req,res){
		Campground.findById(req.params.id, function(err,foundCampground){
			if (err){
				res.redirect("back");
			} else {
				res.render("campgrounds/edit", {campground: foundCampground});
			}
});
});

// UPDATE campgrounds route
router.put("/:id",middleware.checkCampgroundOwnership, function(req,res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if (err){
			res.redirect("/campgrounds");
		}
		else{
			res.redirect("/campgrounds/"+ req.params.id);
		}
	});
});


// DESTROY campgrounds route
router.delete("/:id",middleware.checkCampgroundOwnership, function(req,res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if (err){
			res.redirect("/campgrounds");
		}
		else{
			res.redirect("/campgrounds");
		}
	});
});



module.exports = router;
