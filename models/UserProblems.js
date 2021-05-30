const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userProblemSchema = new Schema({
    userID : {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    ProblemID : {
        type: Schema.Types.ObjectId,
        ref: 'Problem'
    },
    partID : {
        type: Schema.Types.ObjectId,
        ref: 'Part'
    }
});

const UserProblem = mongoose.model("UserProblem", userProblemSchema);

module.exports = UserProblem;