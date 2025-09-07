const express = require("express");

const router = express.Router();

const signupBody = zod.object({
     username: zod.string().email(),
     firstName: zod.string(),
     lastName: zod.string(),
     password: zod.string()
})
//Signup and Signin routes
//We have to made the Three routes 
//1. For the signin and signup for the user
//2. Give me all the list of  users that exist in database
// 3. Let me update my first,last name and password in the database
router.post("/signup", async (req,res) => {
     const { success } = signupBody.safeParse(req.body)
     if(!success) {
         return res.status(411).json({
             message: 'Email already taken/ Incorrect inputs'
         })
     }

     const existingUser = await User.find({
            username: req.body.username
     })

     if(existingUser) {
          return res.status(411).json({
              message: "Email already taken"
          })
     }

     const user = await User.create({
         username: req.body.username,
         password:req.body.password,
         firstName: req.body.firstName,
         lastName: req.body.lastName,
     })

     const userId = user._id;
     const token = jwt.sign({
          userId
     }, JWT_SECRET)

     res.json({
        message: "User created successfully",
        token: token
     })
})

//SignIn Route
router.post('/signin', async (req,res) => {
     const {username,password} = req.body;

     try {
         if(!username) {
             res.status(400).json({
                  message: "User doesnot exist"
             })
         } 

         const isMatch = await bcrypt.compare(password, user.password)
         if(!isMatch) {
             res.status(400).json({
                 message: "Invalid Credentials"
             })
         }

         const token = jwt.sign({id: user._id}, 'JWT_SECRET', {expiresIn: '1h'});
         res.json({ token })
     } catch(err) {
         res.status(500).json({ message: "Internal Server Error"})
     }
})

//List of all the users from the database

router.get("/bulk", async (req,res) => {
     const filter = req.query.filter || "";

     const users = await Users.find({
          $or: [{
               firstName: {
                   "$regex": filter
               }
          }, {
              lastName: {
                  "$regex": filter
              }

          }]
     })

     res.json({
          user: users.map(user => ({
               username: user.username,
               firstName: user.firstName,
               lastName: user.lastName,
               _id: user._id
          }))
     })
})

//Update Route to update the first,last and password field for the user
router.put('/user/:id', async (req,res) => {
      try{
          const userId = req.params.id;
          const {firstName, lastName, password } = req.body;

          const updateFields = {firstName, lastName };

          if(password) {
               const hashedPassword = await bcrypt.hash(password,10);
               updateFields.password = hashedPassword;
          }
          const updateUser = await User.findByIdAndUpdate({ userId, updateFields});
          if(!updateUser) {
              res.status(404).json({ message:"User not found"});
          }
          res.status(200).json({ message: "User updated successfully" });
      } catch(err) {
           res.status(500).json({ message: "Internal Server Error" });
      }
})
module.exports = router;