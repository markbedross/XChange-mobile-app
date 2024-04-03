const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const validator = require('validator')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

userSchema.statics.register = async function(name, email, password) { // static method for registering a new user

    if (!name || !email || !password) throw Error("All fields must be included")
    if (!validator.isEmail(email)) throw Error("Invalid email")
    if (!validator.isStrongPassword(password)) throw Error("Password not strong enough") // checks

    const exists = await this.findOne({ email }) // sees if email exists in db already

    if (exists) throw Error("Email already in use")

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt) // creates hash for password

    const user = await this.create({name, email, password: hash}) // creates user in db

    return user
}

userSchema.statics.login = async function(email, password) { // static method for logging a user in

    if (!email || !password) throw Error("All fields must be included")

    const user = await this.findOne({ email }) // sees if user exists

    if (!user) throw Error("Incorrect email")

    const match = await bcrypt.compare(password, user.password) // if exists, compares password

    if (!match) throw Error("Incorrect password") // if password doesn't match, throws error

    return user
}

userSchema.statics.changeEmail = async function(headers, email) {

    const {authorization} = headers

    if (!authorization) throw Error("Authorization needed")
    if(!email) throw Error("Please enter an email")
    if(!validator.isEmail(email)) throw Error("Invalid email")

    const token = authorization.split(' ')[1] // gets token from authorization header

    try{
        const {_id} = jwt.verify(token, process.env.jwtSecret)

        const user = await this.findOne({_id})

        const emailExists = await this.findOne({email})

        if (emailExists) throw Error("Email already in use")

        if (!user) throw Error("Not authorized")

        const updatedUser = await user.set({email})
        await updatedUser.save()

        return updatedUser

    } catch (err) {
        console.log(err.message)
        throw Error(err.message)
    }
}

userSchema.statics.changePassword = async function(headers, currentPassword, newPassword) {
    const {authorization} = headers

    if (!authorization) throw Error("Authorization needed")
    if(!currentPassword || !newPassword) throw Error("All fields must be included")

    const token = authorization.split(' ')[1] // gets token from authorization header

    try{
        const {_id} = jwt.verify(token, process.env.jwtSecret)

        const user = await this.findOne({_id})

        if (!user) throw Error("Not authorized")

        const match = await bcrypt.compare(currentPassword, user.password) // if exists, compares password

        if(!match) throw Error("Current password incorrect")

        if (!validator.isStrongPassword(newPassword)) throw Error("Password not strong enough")

        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(newPassword, salt) // creates hash for password

        const updatedUser = await user.set({
            password: hash
        })

        await updatedUser.save()

        return updatedUser

    } catch (err) {
        console.log(err.message)
        throw Error(err.message)
    }
}

const UserModel = mongoose.model('User', userSchema)

module.exports = UserModel