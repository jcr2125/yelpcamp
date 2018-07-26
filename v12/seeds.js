var mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment");

var data = [
	{
		name: "Cloud's Rest",
		image: "https://farm7.staticflickr.com/6105/6381606819_df560e1a51.jpg",
		description: "Bacon ipsum dolor amet voluptate beef ribs biltong, tempor sausage dolore ribeye cow aute tail aliqua. Tongue mollit exercitation ham hock leberkas, commodo bacon in boudin ad rump meatloaf adipisicing. Magna sirloin pancetta ex aliqua meatloaf veniam nostrud boudin shank labore deserunt pork chop tri-tip. Aliquip drumstick shoulder kevin, ea adipisicing rump. Magna bacon corned beef shank shoulder officia labore cupim non exercitation. Bacon tempor prosciutto ipsum venison."
	},
	{
		name: "Prairie Fields",
		image: "https://farm9.staticflickr.com/8358/8444469474_8f4b935818.jpg",
		description: "Bacon ipsum dolor amet voluptate beef ribs biltong, tempor sausage dolore ribeye cow aute tail aliqua. Tongue mollit exercitation ham hock leberkas, commodo bacon in boudin ad rump meatloaf adipisicing. Magna sirloin pancetta ex aliqua meatloaf veniam nostrud boudin shank labore deserunt pork chop tri-tip. Aliquip drumstick shoulder kevin, ea adipisicing rump. Magna bacon corned beef shank shoulder officia labore cupim non exercitation. Bacon tempor prosciutto ipsum venison."
	},
	{
		name: "Desert Oasis",
		image: "https://farm3.staticflickr.com/2116/2164766085_0229ac3f08.jpg",
		description: "Bacon ipsum dolor amet voluptate beef ribs biltong, tempor sausage dolore ribeye cow aute tail aliqua. Tongue mollit exercitation ham hock leberkas, commodo bacon in boudin ad rump meatloaf adipisicing. Magna sirloin pancetta ex aliqua meatloaf veniam nostrud boudin shank labore deserunt pork chop tri-tip. Aliquip drumstick shoulder kevin, ea adipisicing rump. Magna bacon corned beef shank shoulder officia labore cupim non exercitation. Bacon tempor prosciutto ipsum venison."
	}
];

function seedDB(){
	//Remove all campgrounds from database to start fresh.
	Campground.remove({}, function(err){
		if(err){
			console.log(err);
		} else {
			console.log("Removed campgrounds from database.");
			
			//Add a few campgrounds to re-seed database.
			data.forEach(function(seedCampground){
				Campground.create(seedCampground, function(err, campground){
					if(err){
						console.log(err);
					} else {
						console.log("Added a campground.");
						
						//Add comment(s) for each seeded campground.
						Comment.create(
							{
								text: "This place is great, but I wish there was internet.",
								author: "Homer"
							}, function(err, comment){
								if(err){
									console.log(err);
								} else {
									campground.comments.push(comment._id);
									campground.save();
									console.log("Created new comment");
								}
							});
					}
				});
			});
		}
	});
}

module.exports = seedDB;