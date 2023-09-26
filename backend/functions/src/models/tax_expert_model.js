const { Schema, model, mongoose } = require('mongoose');
const { expertDB } = require('../config/connect_db');

const ExpertSchema = new Schema({
    allocatedUsers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserModel',  // Reference to the User model
            options: { db: 'userDB' }, // Specify the database for the reference
        },
    ],

    loginDetails: {
        name: { type: String, default: "", trim: true},
        email: { type: String, unique: true, required: true, trim: true },
        password: { type: String, required: true, trim: true },
    },

    personalDetails: {
        firstName: { type: String, default: "", trim: true},
        lastName: { type: String, default: "", trim: true},
        email: { type: String, unique: true, trim: true },
        phoneNumber: {type: String, unique: true},
        dateOfBirth: {type: Date},
        address: {type: String},
        city: {type: String},
        state: {type: String},
        zipCode: {type: String}
    },

    educationDetails: [
        {
            degree: {type: String},
            university: {type: String},
            fieldOfStudy: {type: String},
            graduationYear: {type: String}
        },
    ],

    experienceDetails: [
        {
            companyName: {type: String},
            position: {type: String},
            startDate: {type: Date},
            endDate: {type: Date},
            description: {type: String},
        }
    ]
});

const ExpertModel = expertDB.model('Expert', ExpertSchema);
module.exports = ExpertModel;