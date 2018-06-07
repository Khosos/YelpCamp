var express = require("express"); 
var router = express.Router(); 
var Campground = require("../models/campgrounds"); 
var middleware = require("../middleware"); 

//INDEX -- Show all campgrounds
router.get("/", function(req, res){ 
    Campground.find({}, function(err, allCampgrounds){ 
        if(err){ 
            console.log("Whoops"); 
        } 
        else { 
            res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user}); 
        } 
    }); 
}); 

//CREATE -- Add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){ 
    var name=req.body.name; 
    var image = req.body.image; 
    var desc = req.body.description; 
    var author = {id: req.user._id, username: req.user.username};
    var price = req.body.price; 
    
    var newCg = {name: name, image: image, description: desc, author: author, price: price}; 
    Campground.create(newCg, function(err, newCreated){ 
        if(err){ 
            console.log(err); 
        } 
        else { 
            res.redirect("/campgrounds"); 
        } 
    }); 
}); 

//NEW -- Displays form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){ 
    res.render("campgrounds/new"); 
}); 

//SHOW -- Shows more info about 1 campground
router.get("/:id", function(req, res){ 
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampgroud){
        if(err){ 
            console.log(err); 
        } 
        else { 
            res.render("campgrounds/show", {campground: foundCampgroud}); 
        } 
    }); 
}); 

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit",middleware.checkCampgroundOwnership, function(req, res){ 
    Campground.findById(req.params.id, function(err, foundCampgroud){ 
        res.render("campgrounds/edit", {campground: foundCampgroud});
    }); 
}); 

//UPDATE ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){ 
    //find and update the csorrect campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCg){ 
        if(err){ 
            res.redirect("/campgrounds"); 
        } else {
            res.redirect("/campgrounds/"+req.params.id); 
        } 
    }); 
    //redirect
}); 

//DESTROY ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){ 
    Campground.findByIdAndRemove(req.params.id, function(err){ 
        if(err){ 
            res.redirect("/campgrounds"); 
        } else { 
            res.redirect("/campgrounds"); 
        } 
    }); 
}); 

module.exports = router; 

