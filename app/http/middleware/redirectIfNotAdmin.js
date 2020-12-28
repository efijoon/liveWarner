const User = require('app/models/user');
const middleware = require("./middleware");

class AdminStuff extends middleware {
    
    handle(req , res ,next) {
        if(req.isAuthenticated())   
            return next();
    
        return res.redirect('/');
    }

    isAdmin(req, res, next) {
        if (req.isAuthenticated() && req.user.admin) {           
            res.locals.isAdmin = true;
            next();
        } else {
            res.locals.isAdmin = false;
            next();
        }
    }
    
}

module.exports = new AdminStuff();