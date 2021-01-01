const controller = require('app/http/controllers/controller');
const User = require('app/models/user');
const fs = require('fs');
const path = require('path');

class userController extends controller {

    async profile(req , res) {
        try {
            let user = await User.findById(req.user.id);

            res.render('user/userProfile',  { layout: 'dashboard/master', user });
        } catch (err) {
            next(err);
        }
    }

    async updateProfile(req , res) {
        try {
            await User.findByIdAndUpdate(req.user.id, { ...req.body });

            this.alertAndBack(req, res, {
                title: 'حساب کاربری شما با موفقیت بروزرسانی شد.',
                type: 'success',
                position: 'center',
                toast: true,
                showConfirmButton: false,
                timer: 5000
            });
        } catch (err) {
            next(err);
        }
    }

    async changeProfileImage(req , res, next) {
        // try {

            let user = await User.findById(req.user.id);

            if(user.image) {
                fs.unlinkSync(path.resolve(__dirname, `../../../public/${user.image}`));
            }

            await User.findByIdAndUpdate(req.user.id, { ...req.body, image: req.file.path.substr(6) });

            this.alertAndBack(req, res, {
                title: 'عکس پروفایل شما با موفقیت تغییر یافت.',
                type: 'success',
                position: 'center',
                toast: true,
                showConfirmButton: false,
                timer: 5000
            });
            
        // } catch (err) {
        //     next(err);
        // }
    }

}

module.exports = new userController();