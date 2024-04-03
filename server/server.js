const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

const adRoutes = require('./routes/adRoutes.js')
const userRoutes = require('./routes/userRoutes.js')

const PORT = 8000

app.use(express.json())
app.use(cors())

app.use('/uploads', express.static(__dirname+'/uploads'))

mongoose.connect(process.env.connection)
.then(()=>{
    app.listen(PORT, ()=>console.log(`Listening on ${PORT}`))
})
.catch (err => console.log(err))

app.use('/ad', adRoutes)
app.use('/user', userRoutes)