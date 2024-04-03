const express = require('express')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const fs = require('fs')
require('dotenv').config()

const User = require("../models/User.js")
const Ad = require('../models/Ad.js')

const photoMiddlware = multer({dest: 'uploads'})
const router = express.Router()

router.get('/ads', async (req, res) => { // returns all ads
    res.json(await Ad.find({}))
})

.get('/:id', async (req, res) => { // returns 1 specific ad
    const {id} = req.params
    res.json (await Ad.find({_id: id}))
})

.get('/ads/:query', async(req, res)=>{
    const {query} = req.params
    const ads = await Ad.find({$or: [
        {title: {$regex : query, $options : 'i'}},
        {description: {$regex: query, $options: 'i'}},
        {location: {$regex: query, $options: 'i'}}
    ]})
    res.json(ads)
})

.post('/createAd', async(req, res)=>{ // creates new Ad
    try{
        const ad = await Ad.createAd(req.headers, req.body)
        res.json(ad)
    } catch (err) {
        console.log(err.message)
        res.status(500).json({error: err.message})
    }
})

.get('/createAd/:id', async(req, res)=>{ // returns ad details so update page can be filled in

    const adId = req.params.id

    try{
        const {authorization} = req.headers
    
        if(!authorization) throw Error("Authorization token required")
    
        const token = authorization.split(' ')[1] // gets token from authorization header
        const {_id} = jwt.verify(token, process.env.jwtSecret)
        const user = await User.findOne({_id})
    
        if (!user) throw Error("Not authorized")

        const ad = await Ad.findOne({_id: adId})

        if (user._id.toString() !== ad.owner.toString()) throw Error("Not authorized") // returns only if user and owner match

        res.json(ad)

    } catch (err) {
        console.log(err.message)
        res.status(500).json({error: err.message})
    }

})

.put('/createAd/:id', async(req, res)=>{ // updates an existing ad
    try{
        const ad = await Ad.updateAd(req.headers, req.body)
        res.json(ad)
    } catch (err) {
        console.log(err.message)
        res.status(500).json({error: err.message})
    }
})

.post('/upload', photoMiddlware.array('photos', 100), async(req, res)=>{ // route for uploading images

    try{
        const {authorization} = req.headers
    
        if(!authorization) throw Error("Authorization token required")
    
        const token = authorization.split(' ')[1] // gets token from authorization header
        const {_id} = jwt.verify(token, process.env.jwtSecret)
        const user = await User.findOne({_id})
    
        if (!user) throw Error("Not authorized")

        const uploadedFiles = []
        for (let i = 0; i < req.files.length; i++){
            const {path, originalname} = req.files[i]
            const parts = originalname.split('.')
            const ext = parts[parts.length - 1]
            const newPath = path + '.' + ext
            fs.renameSync(path, newPath)
            uploadedFiles.push(newPath.replace('uploads\\', ''))
        }
        res.json(uploadedFiles)
    } catch(err){
        console.log(err)
        res.status(500).json({error: err.message})
    }
})

.delete('/delete/:id', async (req, res) => { // deletes an ad
    const {id} = req.params
    const deletedAd = await Ad.deleteAd(req.headers, id)
    res.json(deletedAd)
})

module.exports = router