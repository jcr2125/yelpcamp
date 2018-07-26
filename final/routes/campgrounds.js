var express = require("express"),
    router = express.Router(),
    Campground = require("../models/campground"),
    middleware = require("../middleware");

//INDEX CAMPGROUND ROUTE - show all campgrounds.
router.get("/", function(req, res){
    Campground.find({}, function(err, campgrounds){
      if(err){
        req.flash("error", "There was an error: " + err.message);
      } else {
        res.render("campgrounds/index", {campgrounds: campgrounds, page: "campgrounds"});
      }
    });
});

//NEW CAMPGROUND ROUTE - display form to add new campground.
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

//CREATE CAMPGROUND ROUTE - add new campground to database.
router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
         id: req.user._id,
         username: req.user.username
    };
    var newCampground = {name: name, price: price, image: image, description: description, author: author};
    
    //Create a new campground and save to database.
    Campground.create(newCampground, function(err, campground){
      if(err){
		 req.flash("error", "There was an error adding your campground to the database: " + err.message);
		 res.redirect("/campgrounds");
      } else {
		 req.flash("success", "Your campground has been successfully added!");
		 res.redirect("/campgrounds");
      }
    });
});

//SHOW CAMPGROUND ROUTE - displays information about a particular campground in the database.
router.get("/:id", function(req, res){
    //Find the campground with provided ID.
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
		   req.flash("error", "Campground not found");
		   res.redirect("back");
        } else {
            //Render SHOW template with that campground.
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		res.render("campgrounds/edit", {campground: campground});
	});
});

//UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			req.flash("error", "There was an error finding your campground in the database and updating it: " + err.message);
			res.redirect("/campgrounds/");
		} else {
			req.flash("success", "Your campground has been successfully updated!");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//DELETE CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			req.flash("error", "There was an error finding your campground in the database and deleting it: " + err.message);
			res.redirect("/campgrounds/" + req.params.id);
		} else {
			req.flash("success", "Your campground has been deleted.");
			res.redirect("/campgrounds");
		}
	});
});

module.exports = router;