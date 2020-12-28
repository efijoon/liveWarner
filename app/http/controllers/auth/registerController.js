const controller = require("app/http/controllers/controller");
const passport = require("passport");
const i18n = require("i18n");

class registerController extends controller {
  showRegsitrationForm(req, res) {
    res.render("home/auth/register", { title });
  }

  async register(req, res, next) {

    if(req.body.registerPassword !== req.body.confirmpassword ) {
      return this.alertAndBack(req, res, {
        title: 'مقدار رمزعبور با تاییدیه آن تطابق ندارد.',
        type: 'error',
        toast: true
      });
    }

    passport.authenticate("local.register", async (err, newUser) => {

        if (! newUser) {
          return this.alertAndBack(req, res, {
              title: 'چنین کاربری با این نام کاربری در سایت موجود میباشد.',
              type: 'error',
              toast: true
          });
        }

        this.alert(req, {
            title: 'شما هم اکنون در سایت عضو هستید و میتوانید به حساب کاربری خود وارد شوید ...',
            type: 'success',
            toast: true
        });
        res.redirect('/auth/login');

      })(req, res, next);
  }
}

module.exports = new registerController();
