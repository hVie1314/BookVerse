const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String, default: '' },
    role: { 
        type: String, 
        enum: ['admin', 'staff', 'user'], 
        default: 'user' 
    },
    avatar: { type: String, default: '' },
    lastLogin: { type: Date, default: null },
}, {
    timestamps: true,
});

const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;