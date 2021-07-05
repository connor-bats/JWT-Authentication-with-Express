const express= require('express')
const router = express.Router()
const user = require('../models/User')
const jwt = require('jsonwebtoken')
const blogstructure = require('../models/Blog')
require('dotenv').config()



let refreshtokens = []


const aunthenticateToken = (req, res, next) =>{
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1]


    if(token == null){
        return res.sendStatus(401)
    }

    else{
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, User) =>{
            if(err) return res.sendStatus(403)

            req.username  = User
            next()
        })
    }
    
}

router.post('/signup',(req,res) =>{
    const signup = new user({
        name: req.body.name,
        username: req.body.username,
        password: req.body.password,
        email: req.body.email

    })

    signup.save()
        .then(data =>{
            res.status(200).json(data)
        })
        .catch(err =>{
            res.status(200).json(err)
        })
})




router.post('/login',async (req,res) =>{
    
    var valid = false
    user.findOne({username : req.body.username}, (err, User) =>{
        if(err){
            console.log(err)
            res.json({error:"Database error"})
        }
        else{
            
           
            if(User.password !== req.body.password){
                console.log(User.password)
                console.log(req.body.password)
                res.json({error: "Invalid password"})

            }
            else{
                const x = {username : User.username}

                const accessToken = generateAccessToken(x)
                const refreshToken = jwt.sign(x, process.env.REFRESH_TOKEN_SECRET) 
                refreshtokens.push(refreshToken)
                res.json({accessToken : accessToken, refreshToken : refreshToken})

                
            }
        }

        
    })

})



router.get("/loggedin", aunthenticateToken, (req, res) =>{
    res.json({username:req.username.username})
})



router.post('/token',(req,res) =>{
    const refreshToken = req.body.token
    if(refreshToken == null){
        res.sendStatus(401)
    }

    if(!refreshtokens.includes(refreshToken)){
        res.sendStatus(403)
    }
    
    else{
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, User) =>{
        if(err) return res.sendStatus(403)
        const accessToken = generateAccessToken({username : User.username})
        res.json({accessToken: accessToken})
    
    })

    }
}) 



router.delete('/logout',(req, res) =>{
    refreshtokens = refreshtokens.filter(token => token !== req.body.token)
    res.sendStatus(204)
})


const generateAccessToken = (x) =>{
    const token = jwt.sign(x, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '300s'})
    return token
}










// Blog upload

router.post("/uploadBlog",aunthenticateToken,(req,res)=>{
    const newBlog = new blogstructure({
        title: req.body.title,
        content: req.body.content,
        author: req.username.username
    }) 

    newBlog.save()
        .then(data =>{
            res.json(data)
        })
        .catch(err =>{
            res.json(err)
        })
    
})




// See all blogs

router.get("/seeBlogs",(req,res) =>{
    blogstructure.find((err,blog) =>{


        if(err){
            res.json(err)
        }

        else{
            res.json(blog)
        }


})

})


router.get("/seeBlog/:username",(req,res) =>{
    blogstructure.findOne({author : req.params.username})
    .populate("author")
    .exec((err,blogs) =>{

        if(err){
            res.json(err)
        }
        else{
        res.json(blogs)
        }
    })
})

// Get individual blog by ID
router.get("/seeBlog/:id",async(req,res) =>{
    try{
        const blog = await blogstructure.findById(req.params.id)
        
        if(blog != null){

            res.json(blog)
        }
        else{
            res.sendStatus(502)
        }
    }

    catch(err){
        res.json(err)
    }
})






module.exports = router