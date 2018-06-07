var express = require("express"); 
var router = express.Router({mergeParams: true}); 
var Campground = require("../models/campgrounds"); 
var Comments = require("../models/comments"); 
var middleware = require("../middleware"); 

//Comments Routes
router.get("/new", isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampgroud){ 
        if(err){ 
            console.log(err); 
        } else { 
            res.render("comments/new", {campground: foundCampgroud}); 
        } 
    }); 
   }); 

router.post("/", isLoggedIn, function(req, res){ 
    Campground.findById(req.params.id, function(err, foundCampgroud){ 
        if(err){ 
            console.log(err);
            res.redirect("/campgrounds"); 
        } else { 
            Comments.create(req.body.comment, function(err, comment){
                if(err){ 
                    console.log(err); 
                } else { 
                    //add username and id to comment
                    comment.author.id = req.user._id; 
                    comment.author.username = req.user.username; 
                    //save comment
                    comment.save(); 
                    foundCampgroud.comments.push(comment); 
                    foundCampgroud.save(); 
                    res.redirect("/campgrounds/"+foundCampgroud._id); 
                } 
            }); 
        } 
    }); 
}); 

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){ 
    Comments.findById(req.params.comment_id, function(err, foundComment){ 
        if(err){ 
            res.redirect("back"); 
        } else { 
             res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});     
        } 
    }); 
}); 

router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){ 
    Comments.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){ 
        if(err){ 
            console.log(err); 
        } else { 
            res.redirect("/campgrounds/"+req.params.id); 
        } 
    }); 
}); 

router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){ 
    Comments.findByIdAndRemove(req.params.comment_id, function(err){ 
        if(err) { 
            res.redirect("/back"); 
        } else { 
            res.redirect("/campgrounds/"+req.params.id); 
        } 
    }); 
}); 

function isLoggedIn(req, res, next){ 
    if(req.isAuthenticated()){ 
        return next(); 
    } 
    res.redirect("/login");
} 

module.exports = router; 