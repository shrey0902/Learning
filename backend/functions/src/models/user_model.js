const { Schema, model, mongoose } = require('mongoose');
const { userDB } = require('../config/connect_db');

const userSchema = new Schema({
    allocatedExpert: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ExpertModel', // Reference to the TaxExpert login model
        options: { db: 'expertDB' }, // Specify the database for the reference
    },
    name: { type: String, default: "", trim: true},
    email: { type: String, unique: true, required: true, trim: true },
    password: { type: String, required: true, trim: true },
});

const UserModel = userDB.model('User', userSchema);
module.exports = UserModel;