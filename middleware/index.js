var Campground = require("../models/campgrounds");
var Comments = require("../models/comments"); 

var middlewareObj = {}; 

middlewareObj.checkCampgroundOwnership = function(req, res, next){ 
    if(req.isAuthenticated()){ 
        Campground.findById(req.params.id, function(err, foundCampgroud){ 
        if(err){ 
            res.redirect("back"); 
        } else { 
            if(foundCampgroud.author.id.equals(req.user._id)){
                next(); 
            } else { 
                req.flash("error", "You don't have permission to do that"); 
                res.redirect("back"); 
            } 
        } 
    }); 
    } else { 
        console.log("You need to be logged in to do that"); 
        res.redirect("back"); 
    }
}; 

middlewareObj.checkCommentOwnership = function(req, res, next){ 
    if(req.isAuthenticated()){ 
        Comments.findById(req.params.comment_id, function(err, foundComment){ 
        if(err){ 
            res.redirect("back"); 
        } else { 
            console.log(foundComment); 
            if(foundComment.author.id.equals(req.user._id)){
                next(); 
            } else { 
                res.redirect("back"); 
            } 
        } 
    }); 
    } else { 
        console.log("You need to be logged in to do that"); 
        res.redirect("back"); 
    }
}; 

middlewareObj.isLoggedIn = function(req, res, next){ 
    if(req.isAuthenticated()){ 
        return next(); 
    } 
    req.flash("error", "You need to be logged in to do that"); 
    res.redirect("/login"); 
}; 

module.exports = middlewareObj; 