const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('./User')

const adSchema = new mongoose.Schema({
    owner: {type:mongoose.Schema.Types.ObjectId, ref:'User'},
    title: String,
    location: String,
    photos: [String],
    description: String,
    price: Number
})

adSchema.index({ description: "text" })
adSchema.index({ title: "text" })

adSchema.statics.createAd = async function(headers, data){ // static method for creating an ad

    const {authorization} = headers // get authorization token from headers
    const {title, location, photos, description, price} = data // destructure data

    if (!title || !location || !price) throw Error("Title, Location, and Price are required")
    if (isNaN(price)) throw Error("Price must be a number")
    if (!authorization) throw Error("Authorization needed") // checks

    const token = authorization.split(' ')[1] // gets token from authorization header

    try{
        const {_id} = jwt.verify(token, process.env.jwtSecret) // verify user isn't garbage data
        const user = await User.findOne({_id})

        if (!user) throw Error("Not authorized") // if user doesn't exist, throw error

        const ad = await this.create({ // puts ad in db
            owner: _id,
            title,
            location,
            photos,
            description,
            price
        })

        return ad

    } catch (err) {
        console.log(err.message)
        throw Error("Could not create ad")
    }

}

adSchema.statics.updateAd = async function(headers, data){ // add static method to Ad model to update ad

    const {authorization} = headers
    const {id, title, location, photos, description, price} = data

    if (!title || !location || !price) throw Error("Title, Location, and Price are required")
    if (isNaN(price)) throw Error("Price must be a number")
    if (!authorization) throw Error("Authorization needed")

    const token = authorization.split(' ')[1] // gets token from authorization header

    try{
        const {_id} = jwt.verify(token, process.env.jwtSecret) // verify the id from the token
        const user = await User.findOne({_id})

        if (!user) throw Error("Not authorized")

        const ad = await this.findOne({_id: id})

        if (user._id.toString() !== ad.owner.toString()) throw Error("Not authorized") // make sure user is owner

        const updatedAd = await this.updateOne({_id: id}, { // updates ad
            $set: {
                title,
                location,
                photos,
                description,
                price
            }
        })

        return updatedAd

    } catch (err) {
        console.log(err.message)
        throw Error("Could not update")
    }
}

adSchema.statics.deleteAd = async function(headers, id) { // static method for deleting ad
    const {authorization} = headers
    if (!authorization) throw Error("Authorization needed")

    const token = authorization.split(' ')[1] // gets token from authorization header

    try{
        const {_id} = jwt.verify(token, process.env.jwtSecret)
        const user = await User.findOne({_id})

        if (!user) throw Error("Not authorized")

        const ad = await this.findOne({_id: id})

        if (user._id.toString() !== ad.owner.toString()) throw Error("Not authorized")

        const deletedAd = await this.deleteOne({_id: id}) // deletes ad from db

        return deletedAd

    } catch (err) {
        console.log(err.message)
        throw Error("Could not delete")
    }
}

const Ad = mongoose.model('Ad', adSchema)

module.exports = Ad