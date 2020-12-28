const controller = require('./controller');

class HomeController extends controller {
    
    index(req , res) {
        res.render('home/index');
    }

    dashboard(req , res) {
        res.render('dashboard/dashboard', { layout: 'dashboard/master' });
    }

}

module.exports = new HomeController();