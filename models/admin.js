const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const adminSchema = new Schema({
    username: String,
    email : String,
    password : String,
    createdAt : String,
    role: String,
    first_name: String,
    last_name: String
})

const Admin = mongoose.model('Admin', adminSchema)

module.exports = Admin