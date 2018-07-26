var Campground = require("../models/campground"),
    Comments = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function (req, res, next){
	// Is the User logged in?
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, campground){
			if(err || !campground){
				req.flash("error", "Campground not found.");
				res.redirect("back");
			} else {
				// Is the User the person who created the campground (aka "owns" the campground)?
				if(campground.author.id.equals(req.user._id)){
					next();
				} else {
					req.flash("error", "You do not have permission to do that.");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "You must be logged in to do that.");
		res.redirect("back");
	}
};

middlewareObj.checkCommentOwnership = function (req, res, next){
	// Is the User logged in?
	if(req.isAuthenticated()){
		Comments.findById(req.params.comment_id, function(err, comment){
			if(err || !comment){
				req.flash("error", "Comment not found.");
				res.redirect("back");
			} else {
				// Is the User the person who created the comment (aka "owns" the comment)?
				if(comment.author.id.equals(req.user._id)){
					next();
				} else {
					req.flash("error", "You do not have permission to do that.");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "You must be logged in to do that.");
		res.redirect("back");
	}
};

middlewareObj.isLoggedIn = function (req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You must be logged in to do that.");
	res.redirect("/login");
};

module.exports = middlewareObj;