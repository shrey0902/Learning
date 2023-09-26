const UserModel = require('./../models/user_model.js');
require('dotenv').config();
const bcrypt = require('bcrypt');

const UserController = {

    signUp: async function(req, res) {
        try {
            const { name, email, password } = req.body;

            // check if user already exist in database
            const oldUser = await UserModel.findOne({ email: email });
            if (oldUser) {
                return res.json({success: false,message: "User Already Exist. Please Login"});
            }

            let newHashedPassword;
            if(password === null) {
                newHashedPassword = "temporary";
            } else {
                const salt = await bcrypt.genSalt(10); 
                newHashedPassword = await bcrypt.hash(password, salt);
            }
            // const salt = await bcrypt.genSalt(10); 
            // const newHashedPassword = await bcrypt.hash(password, salt);

            // creating new user and saving in database
            const newUser = new UserModel({
                name: name,
                email: email,
                password: newHashedPassword,
            });

            await newUser.save();
            return res.status(201).json({ success: true, data: newUser, message: "User created!"});
        }
        catch(error) {
            return res.json({ success: false, message: error.message });
        }
    },

    signIn: async function(req, res) {
        try {
            const { email, password } = req.body;

            // validate if user exist in database
            const foundUser = await UserModel.findOne({ email: email });
            if(!foundUser) {
                return res.json({ success: false, message: "User doesn't exist" });
            }

            // checking if the password matches
            if(password != "temporary") {
                const passwordsMatch = await bcrypt.compare(password, foundUser.password);
                if(!passwordsMatch) {
                    return res.json({ success: false, message: "Incorrect email or password!" });
            }
            }

            // generate jwt token
            // const token = jwt.sign({userId: foundUser._id}, process.env.JWT_SECRETE_KEY, {expiresIn: '2d'});

            return res.json({ success: true, data: foundUser, message: "Login Successful!" });
        }
        catch(error) {
            return res.json({ success: false, message: error.message });
        }
    },
};

module.exports = UserController;