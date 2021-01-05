const express = require('express');
const app = express();
const http = require('http');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');
const Helpers = require('./helpers');
const methodOverride = require('method-override');
const helmet = require('helmet');
const csrf = require('csurf');
const csrfErrorHandler = require('app/http/middleware/csrfErrorHandler');
const rememberLogin = require('app/http/middleware/rememberLogin');
const warner = require('./http/middleware/warner');

module.exports = class Application {
    constructor() {
        this.setupExpress();
        this.setMongoConnection();
        this.setConfig();
        this.setRouters();
    }


    setupExpress() {
        const server = http.createServer(app);
        server.listen(process.env.PORT || 3000 , () => console.log(`Listening on port ${process.env.PORT}`));
    }

    setMongoConnection() {
        mongoose.Promise = global.Promise;
        mongoose.connect(config.database.url ,
         { 
           useNewUrlParser: true,
           useUnifiedTopology: true,
           useCreateIndex: true,
           useFindAndModify: false,
         })
        .then(() => console.log(`Connected ...`))
        .catch((err) => console.log(err.message));
    }

    /**
     * Express Config
     */
    setConfig() {
        require('app/passport/passport-local');
 
        app.enable('trust proxy');
        app.use(helmet());
        app.use(express.static(config.layout.public_dir));
        app.set('view engine', config.layout.view_engine);
        app.set('views' , config.layout.view_dir);
        app.use(config.layout.ejs.expressLayouts);
        app.set("layout extractScripts", config.layout.ejs.extractScripts);
        app.set("layout extractStyles", config.layout.ejs.extractStyles);
        app.set("layout" , config.layout.ejs.master);


        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended : true }));
        app.use(methodOverride('_method'));
        app.use(session({...config.session}));
        app.use(cookieParser(config.cookie_secretkey));
        app.use(flash());
        app.use(passport.initialize());
        app.use(passport.session());
        app.use(rememberLogin.handle);

        app.use((req , res , next) => {
            app.locals = new Helpers(req, res).getObjects();
            next();
        });

        let i = 0;
        app.use(function(req , res , next) {
            if(i < 1) {
                warner.handle(req, res, next)
            }
            i++;
            next();
        }); 
    }

    setRouters() {
        // csrf({ cookie : true }) ,
        app.use(require('app/routes/web'));
        // app.use(csrfErrorHandler.handle);
    }
}