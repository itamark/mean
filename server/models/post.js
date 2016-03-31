var mongoose = require('mongoose');

module.exports = mongoose.model('Post', {
    user_id: {type: Number, default:0},
    content : String,
    date : {type: Date, default: Date.now()},
    flagged: {type: Boolean, default: false},
    removed: {type: Boolean, default: false},
    live: {type: Boolean, default: true},
    meta: {type: Boolean, default: false},
    must_read: {type: Boolean, default: false},
});