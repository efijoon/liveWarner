const autoBind = require('auto-bind');
const Recaptcha = require('express-recaptcha').Recaptcha;
const { validationResult } = require('express-validator/check');
const isMongoId = require('validator/lib/isMongoId');
const sprintf = require('sprintf-js').sprintf;
const ActivationCode = require("app/models/activationCode");
const uniqueString = require('unique-string');
const mail = require("app/helpers/mail");

module.exports = class controller {
  constructor() {
    autoBind(this);
    this.recaptchaConfig();
  }

  recaptchaConfig(lang) {
    this.recaptcha = new Recaptcha(
      config.service.recaptcha.client_key,
      config.service.recaptcha.secret_key,
      { hl: lang }
    );
  }

  recaptchaValidation(req, res) {
    return new Promise((resolve, reject) => {
      this.recaptcha.verify(req, (err, data) => {
        if (err) {
          req.flash(
            "errors",
            "گزینه امنیتی مربوط به شناسایی روبات خاموش است، لطفا از فعال بودن آن اطمینان حاصل نمایید و مجدد امتحان کنید"
          );
          this.back(req, res);
        } else resolve(true);
      });
    });
  }

  back(req, res) {
    req.flash("formData", req.body);
    return res.redirect(req.header("Referer") || "/");
  }

  isMongoId(paramId) {
    if (!isMongoId(paramId)) this.error("ای دی وارد شده صحیح نیست", 404);
  }

  error(message, status = 500) {
    let err = new Error(message);
    err.status = status;
    throw err;
  }

  slug(title) {
    return title.replace(/([^۰-۹آ-یa-z0-9]|-)+/g, "-");
  }

  alert(req, data) {
    let title = data.title || "",
      message = data.message || "",
      type = data.type || "info",
      button = data.button || null,
      timer = data.timer || 6000,
      toast = data.toast || false,
      position = data.position || 'center';

    req.flash("SAmessages", { title, message, type, button, timer, toast, position });
  }

  async alertAndBack(req, res, data) {
    await this.alert(req, data);
    return this.back(req, res);
  }

  async sendActivationLink(req, res, next, user) {
    try {
      let code = uniqueString();
      let newActiveCode = new ActivationCode({
        user: user.id,
        code,
        expire: Date.now() + 1000 * 60 * 10,
      });
      await newActiveCode.save();

      let mailOptions = {
        from: '"فروشگاه اینترنتی عرفان', // sender address
        to: `${req.body.email}`, // list of receivers
        subject: "فعالسازی حساب فروشگاه", // Subject line
        html: `
            <p>برای فعال شدن اکانت بر روی لینک زیر کلیک کنید</p>
            <h2><a href="${config.siteurl}/user/activation/${newActiveCode.code}">فعال سازی</a></h2>
        `, // html body
      };

      mail.sendMail(mailOptions, (err, info) => {
        if (err) return console.log(err);

      });
    } catch (err) {
      next(err);
    }
  }
};