//nodemon refreshes the server automatically

require("dotenv").config()

const express = require('express')
const app = express()

const jwt = require('jsonwebtoken')

app.use(express.json())
const posts = [
    { 
        username: "Somesh",
        title: "Post 1"
    },
    { 
        username: "Swathi",
        title: "Post 2"
    }
]
app.get('/posts', authenticateToken, (req, res) =>{
    res.json(posts.filter(post => post.username == req.user.name))
})
app.post('/login', (req, res) =>{
    //Authenticate user
    const username = req.body.username
    const user = {name : username}

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET) //serialized
    // to get random secret key require('crypto').randomBytes(64).toString('hex')
    res.json( { accessToken: accessToken })
})
//middleware
function authenticateToken(req, res, next) {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        if(token == null) return res.sendStatus(401) //no token, unauthorized

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) =>{
            if(err) return res.sendStatus(403) //forbidden
            req.user = user
            next()
        })
    }
app.listen(3000)