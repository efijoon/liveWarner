const controller = require("./controller");

class HomeController extends controller {
  index(req, res) {
    res.render("home/main", { title: "هشداردهنده مصدقیان" });
  }

  dashboard(req, res) {
    res.render("dashboard/dashboard", { layout: "dashboard/master" });
  }
}

module.exports = new HomeController();
