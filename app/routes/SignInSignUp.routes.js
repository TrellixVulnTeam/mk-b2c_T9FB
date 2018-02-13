module.exports = function(app) {

    var user = require('../controllers/SignInSignUp.controller.js');


    app.post('/API/SigninSignup/Register', user.Register);

    app.get('/API/SigninSignup/NameValidate/:name', user.NameValidate);

    app.get('/API/SigninSignup/EmailValidate/:email', user.EmailValidate);

    app.get('/API/SigninSignup/UserValidate/:email/:password', user.UserValidate);

    app.get('/API/SigninSignup/FBUserValidate/:email/:fbid', user.FBUserValidate);

    app.get('/API/SigninSignup/GetNotification/:UserId', user.GetNotification);

    app.get('/API/SigninSignup/RemoveNotification/:NotifyId', user.RemoveNotification);

    app.post('/API/SigninSignup/UserValidate', user.MobileUserValidate);

    app.get('/API/SigninSignup/GetUserInfo/:UserId/:LoginUserId', user.GetUserInfo);

}