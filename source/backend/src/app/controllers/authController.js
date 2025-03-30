const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthController {

   // [POST] /auth/register
   register(req, res) {
      // get data from request
      const { username, email, password, role } = req.body;

      // check if username or email already exists
      User.findOne({ $or: [{ username: username }, {email: email }]})
      .then(user => {
         // if username or email already exists, then return error
         if (user) {
            return res.status(400).json({
               success: false,
               errorCode: "USER_ALREADY_EXISTS"
            });
         }

         // gen hash password
         const salt = bcrypt.genSaltSync(10);
         const hashPassword = bcrypt.hashSync(password, salt);

         // create new user
         const newUser = new User({
            username: username,
            email: email,
            password: hashPassword,
            roleId: role
         });

         // save user to database
         newUser.save()
            .then(user => {
               res.status(201).json({
                  success: true,
                  data: {
                     id: user._id,
                     username: user.username,
                     email: user.email,
                     roleId: user.roleId,
                     avatar: user.avatar
                  },
               })
            })
      })
      .catch(err => {
         console.error(err);

         res.status(500).json({
            success: false,
            errorCode: "INTERNAL_SERVER_ERROR",
         })
      });
   }

   // [POST] /auth/login

}

module.exports = new AuthController();