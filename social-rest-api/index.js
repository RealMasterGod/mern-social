const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const helmet = require('helmet')
const morgan = require('morgan')
const userRoute = require('./routes/users')
const authRoute = require('./routes/auth')
const postRoute = require('./routes/posts')
const conversationRoute = require('./routes/conversations')
const messageRoute = require('./routes/messages')
const multer = require('multer')
const path = require('path')
const cors = require('cors')

dotenv.config()

mongoose.connect(process.env.MONGODB_URI).then(() => console.log("Connected To DB")).catch(err => console.log(err))

app.use("/images",express.static(path.join(__dirname,"public/images")))

//middlewares
app.use(cors())
app.use(express.json())
app.use(helmet())
app.use(morgan('common'))

const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null,"public/images")
    },
    filename: (req,file,cb) => {
        cb(null,req.body.name)
    }
})

const upload = multer({storage: storage})

app.post("/api/upload", upload.single("file"), (req,res) => {
    try {
        return res.status(200).json("File uploaded successfully.")
    } catch (err) {
        console.log(err)
    }
})

app.use('/api/users',userRoute)
app.use('/api/auth',authRoute)
app.use('/api/posts',postRoute)
app.use('/api/conversations',conversationRoute)
app.use('/api/messages',messageRoute)

app.get("/", (req,res) => {
    res.status(200).json("hello")
})

app.get("/api", (req,res) => {
    res.status(200).json("api working")
})

app.listen(process.env.PORT || 5000, () => {
    console.log('Server running on port 5000...')
})