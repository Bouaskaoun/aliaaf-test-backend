const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// //REGISTER
// router.post("/register", async (req, res) => {
//   const newUser = new User({
//     username: req.body.username,
//     email: req.body.email,
//     password: CryptoJS.AES.encrypt(
//       req.body.password,
//       process.env.PASS_SEC
//     ).toString(),
//     isAdmin: req.body.isAdmin,
//   });

//   try {
//     const savedUser = await newUser.save();
//     res.status(201).json(savedUser);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// //LOGIN

// router.post('/login', async (req, res) => {
//     try{
//         const user = await User.findOne(
//             {
//                 username: req.body.username
//             }
//         );

//         //!user && res.status(401).json("Wrong User Name");
//         if (!user) {
//             res.status(401).json("Wrong User Name");
//         }


//         const hashedPassword = CryptoJS.AES.decrypt(
//             user.password,
//             process.env.PASS_SEC
//         );


//         const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

//         const inputPassword = req.body.password;
        
//         originalPassword != inputPassword && 
//             res.status(401).json("Wrong Password");

//         const accessToken = jwt.sign(
//         {
//             id: user._id,
//             isAdmin: user.isAdmin,
//         },
//         process.env.JWT_SEC,
//             {expiresIn:"3d"}
//         );
  
//         const { password, ...others } = user._doc;  
//         res.status(200).json({...others, accessToken});

//     }catch(err){
//         res.status(500).json(err);
//     }

// });

// register endpoint
router.post("/register", (request, response) => {
  // hash the password
  bcrypt
    .hash(request.body.password, 10)
    .then((hashedPassword) => {
      // create a new user instance and collect the data
      const user = new User({
        username: request.body.username,
        email: request.body.email,
        password: hashedPassword,
        isAdmin: request.body.isAdmin,
      });

      // save the new user
      user
        .save()
        // return success if the new user is added to the database successfully
        .then((result) => {
          response.status(201).send({
            message: "User Created Successfully",
            result,
          });
        })
        // catch error if the new user wasn't added successfully to the database
        .catch((error) => {
          response.status(500).send({
            message: "Error creating user",
            error,
          });
        });
    })
    // catch error if the password hash isn't successful
    .catch((e) => {
      response.status(500).send({
        message: "Password was not hashed successfully",
        e,
      });
    });
});

// login endpoint
router.post("/login", (request, response) => {
  // check if email exists
  User.findOne({ username: request.body.username })

    // if email exists
    .then((user) => {
      // compare the password entered and the hashed password found
      bcrypt
        .compare(request.body.password, user.password)

        // if the passwords match
        .then((passwordCheck) => {

          // check if password matches
          if(!passwordCheck) {
            return response.status(400).send({
              message: "Passwords does not match",
              error,
            });
          }

          //   create JWT token
          const token = jwt.sign(
            {
              userId: user._id,
              isAdmin: user.isAdmin,
            },
            "RANDOM-TOKEN",
            { expiresIn: "365d" }
          );

          //   return success response
          response.status(200).send({
            message: "Login Successful",
            username: user.username,
            isAdmin: user.isAdmin,
            token,
          });
        })
        // catch error if password does not match
        .catch((error) => {
          response.status(400).send({
            message: "Passwords does not match",
            error,
          });
        });
    })
    // catch error if email does not exist
    .catch((e) => {
      response.status(404).send({
        message: "Username not found",
        e,
      });
    });
});

module.exports = router;