const persianjs = require("persianjs");
const middleware = require("./middleware");
const Warning = require("../../models/Warning");
const Namad = require("../../models/Namad");
const nodemailer = require("nodemailer");

class redirectIfAuthenticated extends middleware {
  async handle(req, res, next) {
    if (req.isAuthenticated()) {
      let warnings;

      let symbol;
      setInterval(async () => {
        warnings = await Warning.find({ user: req.user.id });

        if (warnings.length > 0) {
          warnings.forEach(async (item) => {
            symbol = await Namad.findOne({ namadID: item.symbolID });

            if (!item.sent) {
              switch (item.compareField) {
                case "0":
                  this.comparator(
                    item,
                    parseFloat(this.fixNumber(symbol.data["dealingPrice"])),
                    req.user
                  );
                  break;
                case "1":
                  this.comparator(
                    item,
                    parseFloat(
                      this.fixNumber(symbol.data["dealingPricePercent"])
                    ),
                    req.user
                  );
                  break;
                case "2":
                  this.comparator(
                    item,
                    parseFloat(this.fixNumber(symbol.data["lastPrice"])),
                    req.user
                  );
                  break;
                case "3":
                  this.comparator(
                    item,
                    parseFloat(this.fixNumber(symbol.data["lastPricePercent"])),
                    req.user
                  );
                  break;
                case "4":
                  this.comparator(
                    item,
                    parseFloat(this.fixNumber(symbol.data["hajmMoamelat"])),
                    req.user
                  );
                  break;
                case "5":
                  this.comparator(
                    item,
                    parseFloat(this.fixNumber(symbol.data["arzeshMoamelat"])),
                    req.user
                  );
                  break;
              }
            }
          });
        }
      }, 2000);
    }
  }

  async comparator(item, compareValue, user) {
    switch (item.comparator) {
      case "gt":
        if (compareValue > item.compareNumber) {
          this.sendWarnMail(
            `با سلام. با توجه به مقدار ${compareValue} سهام ${item.symbolName} شما. شرطی که با مقدار بزرگتر از ${item.compareNumber} تعیین کردید، فعال شد و شما میتوانید اقدام به خرید یا فروش سهام خود کنید. با تشکر از اعتماد شما به این پلتفرم 🙏`,
            user.email,
            item
          );
        }
        break;
      case "gte":
        if (compareValue >= item.compareNumber) {
          this.sendWarnMail(
            `با سلام. با توجه به مقدار ${compareValue} سهام ${item.symbolName} شما. شرطی که با مقدار بزرگتر و مساوی ${item.compareNumber} تعیین کردید، فعال شد و شما میتوانید اقدام به خرید یا فروش سهام خود کنید`,
            user.email,
            item
          );
        }
        break;
      case "lt":
        if (compareValue < item.compareNumber) {
          this.sendWarnMail(
            `با سلام. با توجه به مقدار ${compareValue} سهام ${item.symbolName} شما. شرطی که با مقدار کمتر از ${item.compareNumber} تعیین کردید، فعال شد و شما میتوانید اقدام به خرید یا فروش سهام خود کنید`,
            user.email,
            item
          );
        }
        break;
      case "lte":
        if (compareValue <= item.compareNumber) {
          this.sendWarnMail(
            `با سلام. با توجه به مقدار ${compareValue} سهام ${item.symbolName} شما. شرطی که با مقدار کمتر و مساوی ${item.compareNumber} تعیین کردید، فعال شد و شما میتوانید اقدام به خرید یا فروش سهام خود کنید`,
            user.email,
            item
          );
        }
        break;
      case "e":
        if ((item.compareNumber = compareValue)) {
          this.sendWarnMail(
            `با سلام. با توجه به مقدار ${compareValue} سهام ${item.symbolName} شما. سهام شما با مقدار ${item.compareNumber} که مشخص کردید برابر است و شما میتوانید اقدام به خرید یا فروش سهام خود کنید`,
            user.email,
            item
          );
        }
        break;
    }
  }

  fixNumber(str) {
    if (str.includes("٪")) {
      str = str.replace(/٪/g, "");
      str = str.replace(/٫/g, ".");
    }

    if (str.includes("٫")) str = str.replace(/٫/g, ".");

    str = str.replace(/٬/g, "");

    const convertedStr = persianjs(str).persianNumber();

    return convertedStr;
  }

  async sendWarnMail(body, email, warning) {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "mosaddeghwarner@gmail.com",
        pass: "@Thisismosaddeghwarner85",
      },
    });

    console.log("ُSending email for warning: " + warning.symbolName);

    let mailOptions = {
      from: "mosaddeghwarner@gmail.com",
      to: email,
      subject: "هشدار دهنده مصدقیان",
      html: `<h1 style="font-family: Vazir;font-weight: 600;text-align: center;border: 5px solid red;border-radius: 20px;padding: 15px;">${body}</h1>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      console.log(error, info.response);
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    warning.sent = true;
    await warning.save();
  }
}

module.exports = new redirectIfAuthenticated();
