const path = require("path");
const autoBind = require("auto-bind");
const momentJalaali = require("moment-jalaali");
momentJalaali.loadPersian({ usePersianDigits: true });
const Course = require('app/models/course');

module.exports = class Helpers {
  constructor(req, res) {
    autoBind(this);
    this.req = req;
    this.res = res;
    this.formData = req.flash("formData")[0];
  }

  getObjects() {
    return {
      auth: this.auth(),
      viewPath: this.viewPath,
      ...this.getGlobalVaribales(),
      old: this.old,
      date: this.date,
      req: this.req,
      persianDate: this.persianDate,
    };
  }

  auth() {
    return {
      check: this.req.isAuthenticated(),
      user: this.req.user,
    };
  }

  viewPath(dir) {
    return path.resolve(config.layout.view_dir + "/" + dir);
  }

  getGlobalVaribales() {
    return {
      errors: this.req.flash("errors"),
      messages: this.req.flash("success"),
      SAmessages: this.req.flash("SAmessages"),
    };
  }

  old(field, defaultValue = "") {
    return this.formData && this.formData.hasOwnProperty(field) ? this.formData[field] : defaultValue;
  }

  persianDate(time) {
    return momentJalaali(time);
  }
};
