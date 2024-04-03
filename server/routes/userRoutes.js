const express = require('express')
const jwt = require('jsonwebtoken')

const User = require("../models/User")
const Ad = require('../models/Ad')

const router = express.Router()

const createToken = _id => jwt.sign({_id}, process.env.jwtSecret, { expiresIn: '5d' })

router.get('/ads', async(req, res)=>{ // route for getting user's ads

    try {
    const {authorization} = req.headers
    
    if(!authorization) throw Error("Authorization token required")

    const token = authorization.split(' ')[1] // gets token from authorization header
    const {_id} = jwt.verify(token, process.env.jwtSecret)
    const user = await User.findOne({_id})

    if (!user) throw Error("Not authorized")

    const ads = await Ad.find({owner: _id})

    res.json(ads)

    } catch (err) {
        res.status(500).json({error: err.message})
    }
})

.post('/register', async (req, res)=>{

    const {name, email, password} = req.body

    try{
        const user = await User.register(name, email, password)
        const token = createToken(user._id)
        res.json({name, email, token})
    } catch (err) {
        res.status(500).json({error: err.message})
    }
})

.post('/login', async (req, res)=>{

    const {email, password} = req.body

    try{
        const user = await User.login(email, password)
        const name = user.name
        const token = createToken(user._id)
        res.json({name, email, token})
    } catch (err) {
        res.status(500).json({error: err.message})
    }
})

.patch('/changeEmail', async(req, res)=>{

    const { newEmail } = req.body

    try{
        const updatedUser = await User.changeEmail(req.headers, newEmail)
        const token = createToken(updatedUser._id)
        res.json({name: updatedUser.name, email: updatedUser.email, token})
    } catch (err) {
        console.log(err.message)
        res.status(500).json({error: err.message})
    }

})

.patch('/changePassword', async(req, res)=>{

    const {currentPassword, newPassword} = req.body

    try{
        const updatedUser = await User.changePassword(req.headers, currentPassword, newPassword)
        const token = createToken(updatedUser._id)
        res.json({name: updatedUser.name, email: updatedUser.email, token})
    } catch (err) {
        console.log(err.message)
        res.status(500).json({error: err.message})
    }

})

module.exports = router