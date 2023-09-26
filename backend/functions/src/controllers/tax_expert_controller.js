const ExpertModel = require('./../models/tax_expert_model.js');
const UserModel = require('./../models/user_model.js');
require('dotenv').config();
const bcrypt = require('bcrypt');

const ExpertController = {

    signUp: async function(req, res) {
        try {
            const { name, email, password, globalpersonalDetails, globaleducationDetails, globalexperienceDetails} = req.body;
            // check if expert already exist in database
            const oldUser = await ExpertModel.findOne({ 'loginDetails.email': email });

            if (oldUser) {
                return res.json({success: false,message: "Expert Already Exist. Please Login"});
            }

            let newHashedPassword;
            if(password === null) {
                newHashedPassword = "temporary";
            } else {
                const salt = await bcrypt.genSalt(10); 
                newHashedPassword = await bcrypt.hash(password, salt);
            }

            // creating new expert and saving in database
            const newUser = new ExpertModel({
                loginDetails: {
                    name: name,
                    email: email,
                    password: newHashedPassword,
                },
                personalDetails: globalpersonalDetails,
                educationDetails: globaleducationDetails,
                experienceDetails: globalexperienceDetails
            });

            await newUser.save();
            return res.status(201).json({ success: true, data: newUser, message: "Expert created!"});
        }
        catch(error) {
            return res.json({ success: false, message: error.message });
        }
    },

    signIn: async function(req, res) {
        try {
            const { email, password } = req.body;

            // validate if expert exist in database
            const foundUser = await ExpertModel.findOne({ 
                "loginDetails.email": email 
            });

            if(!foundUser) {
                return res.json({ success: false, message: "Expert doesn't exist" });
            }

            // checking if the password matches
            if(password != "temporary") {
                const passwordsMatch = await bcrypt.compare(password, foundUser.loginDetails.password);
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

    saveAllData: async function(req, res) {
        try {
            const {globalpersonalDetails, globaleducationDetails, globalexperienceDetails} = req.body;

            // Extract email from globalpersonalDetails
            const email = globalpersonalDetails.email;

            // Check if the user exists in the database
            const user = await ExpertModel.findOne({ 'loginDetails.email': email });
            if (!user) {
                return res.json({ success: false, message: "User not found." });
            }

            user.personalDetails = globalpersonalDetails;
            user.educationDetails = globaleducationDetails;
            user.experienceDetails = globalexperienceDetails;

            // Save the updated user document
            await user.save();
            
            return res.json({ success: true, message: "Data saved successfully" });
        } catch (error) {
            return res.json({ success: false, message: error.message });
        }
    },

    fetchTaxExperts: async function(req, res) {
        try {
            const data = await ExpertModel.find();

            return res.json({ success: true, data: data });
        } catch (error) {
            return res.json({ success: false, message: error });
        }
    },

    searchTaxExperts: async function(req, res) {
        try {
            const {location} = req.query;
            const data = await ExpertModel.find({ 
                'personalDetails.state': location
             });

            return res.json({ success: true, data: data });
        } catch (error) {
            return res.json({ success: false, message: error });
        }
    },

    // Hire an expert
    hireExpert: async function(req, res) {
        try {
            const { expertId, userId } = req.body;

            // Check if the expert and user exist
            const expert = await ExpertModel.findById(expertId);
            const user = await UserModel.findById(userId);

            if (!expert || !user) {
                return res.status(404).json({ success: false, message: 'Expert or user not found.' });
            }

            user.allocatedExpert = expertId;
            await user.save();

            expert.allocatedUsers.push(userId);
            await expert.save();

            return res.status(200).json({ success: true, message: 'Expert hired by the user.' });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // Get allocated users for an expert
    getAllocatedUsers: async function(req, res) {
        try {
            const { expertId } = req.params;
            const expert = await ExpertModel.findById(expertId)
            
            if (!expert) {
                return res.status(404).json({ success: false, message: 'Expert not found.' });
            }

            // Extract the user IDs from allocatedUsers array
            const userIds = expert.allocatedUsers;

            // Fetch user details for the extracted user IDs
            const allocatedUsers = await UserModel.find({ _id: { $in: userIds } }, 'name email');

            return res.status(200).json({ success: true, allocatedUsers: allocatedUsers });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    checkEmail: async function(req, res) {
        const { email } = req.query;
        // Check if the email exists in the "expert" database
        const expertUser = await ExpertModel.findOne({ 'loginDetails.email': email });
        const normalUser = await UserModel.findOne({ email });
        if (expertUser) 
            res.json({ role: 'expert' });
        else if (normalUser)
            res.json({ role: 'user' });
        else
            res.json({ role: 'user not found' });
    },
}

module.exports = ExpertController;



