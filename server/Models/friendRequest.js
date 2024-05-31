const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FriendReqSchema = new Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
    status: { type: String, enum: ['accepted', 'rejected', 'pending'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FriendReq', FriendReqSchema);