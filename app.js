const express = require("express")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const app = express()


app.use(express.json)
app.use(express.urlencoded({extended: false}))
app.set('view engine', 'ejs')

let user ={
    id: 123,
    email: "imsomeshp18@gmail.com",
    password: "asdabvkAJBEFIUBEW"
}
app.get("/", (req, res) => {
    res.send("Hello World");
})
app.get("/forgot-password", (req, res, next) => {
   res.render("forgot-pasword");
})
app.post("/forgot-password", (req, res, next) => {
    const { email } = res.body;
   //if email exists, create new secret for each user
   const secret = process.env.JWT_SECRET + user.password  // JWT is common but password is diff
   const payload = {
    id: user.id,
    email: user.email
   }
   const token = jwt.sign(payload, secret, {expiresIn: '15m'}) // expiry
   const link = `http://localhost:3000/reset-password/${user.id}/${token}`
   console.log(link)
})
app.get("/reset-password/:id/:token", (req, res, next) => {
    const {id, token} = req.params

    //user exists
    const secret = process.env.JWT_SECRET + user.password

    try {
        const payload = jwt.verify(token, secret)
        res.render("reset-password", {email: user.email}) // passing the email to template
    } catch (error) {
        console.log(error.message)
        res.send(error.message)
    }
})
app.post("/reset-password/:id/:token", (req, res, next) => {
    const {id, token} = req.params
    const {password, password2} = req.body

    //check valid id

    const secret = process.env.JWT_SECRET + user.password

    try {
        const payload = jwt.verify(token, secret)
        //validate both passwords
        //from the payload we can find the user from the database using email and id
        //hash passwords before saving
        user.password = password
        res.send(user)
    } catch (error) {
        console.log(error.message)
        res.send(error.message)
    }
    
})
app.listen(3000, () => console.log("@http://localhost:3000"))