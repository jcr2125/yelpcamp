var express = require("express"),
    router = express.Router({mergeParams: true}),
    Campground = require("../models/campground"),
    Comments = require("../models/comment"),
    middleware = require("../middleware");

//NEW COMMENTS ROUTE
router.get("/new", middleware.isLoggedIn, function(req, res){
     Campground.findById(req.params.id, function(err, campground){
          if(err){
               req.flash("error", "There was an error finding the campground you wish to comment on in the database: " + err.message);
			res.redirect("back");
          } else {
               res.render("comments/new", {campground: campground});
          }
     });
});

//CREATE COMMENTS ROUTE
router.post("/", middleware.isLoggedIn, function(req, res){
     Campground.findById(req.params.id, function(err, campground){
          if(err){
               req.flash("error", "There was an error finding the campground you wish to comment on in the database: " + err.message);
               res.redirect("/campgrounds");
          } else {
               Comments.create(req.body.comment, function(err, comment){
                    if(err){
                         req.flash("error", "There was an error adding your comment to the database: " + err.message);
					res.redirect("back");
                    } else {
					//Add user ID and username to comment.
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					
					//Save the comment with user ID and username.
					comment.save();
					
					//Add comment to the campground.
                         campground.comments.push(comment._id);
				     campground.save();
					req.flash("success", "Your comment has been successfully added!");
				     res.redirect("/campgrounds/" + campground._id);
			     }
			});
          }
     });
});

//EDIT COMMENTS ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err || !foundCampground){
			req.flash("err", "Campground not found.");
			return res.redirect("back");
		}
		Comments.findById(req.params.comment_id, function(err, comment){
			if(err){
				req.flash("error", "There was an error: " + err.message);
				res.redirect("back");
			} else {
				res.render("comments/edit", {campground_id: req.params.id, comment: comment});
			}
		});
	});
});

//UPDATE COMMENTS ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err || !foundCampground){
			req.flash("err", "Campground not found.");
			return res.redirect("back");
		}
		Comments.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment){
			if(err){
				req.flash("error", "There was an error finding and updating the comment you wish to edit in the database: " + err.message);
				res.redirect("back");
			} else {
				req.flash("success", "Your comment has been successfully updated!");
				res.redirect("/campgrounds/" + req.params.id);
			}
		});
	});
});

//DELETE COMMENTS ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err || !foundCampground){
			req.flash("err", "Campground not found.");
			return res.redirect("back");
		}
		Comments.findByIdAndRemove(req.params.comment_id, function(err){
			if(err){
				req.flash("error", "There was an error finding your comment in the database and deleting it: " + err.message);
				res.redirect("back");
			} else {
				req.flash("success", "Your comment has been deleted.")
				res.redirect("/campgrounds/" + req.params.id);
			}
		});
	});
});

module.exports = router;