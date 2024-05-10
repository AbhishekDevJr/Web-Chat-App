const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: { type: String, require: true, maxLength: 150 },
    lastName: { type: String, require: true, maxLength: 150 },
    email: { type: String, require: true, maxLength: 150 },
    password: { type: String, require: true, maxLength: 150 },
    createdAt: { type: Date, require: true, default: new Date() }
});

module.exports = mongoose.model('User', UserSchema);