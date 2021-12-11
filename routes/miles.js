const express = require("express")
const router = express.Router()
const User = require("../models/user")
const jwt = require("jsonwebtoken")

// Update
router.patch('/:id', getUser, async (req, res) => {
    if(req.body.name != null) {
        res.user.name = req.body.name
    }
    if(req.body.miles != null) {
        res.user.miles = req.body.miles
    }

    try {
        const updatedUser = await res.user.save()
        res.json(updatedUser)
    } catch(err) {
        res.status(400).json({ message: err.message })
    }

})

// Get
router.get('/:id', getUser, (req, res) => {
    res.json(res.user)
})
// Delete 
router.delete('/:id', getUser, async (req, res) => {
    try { 
        await res.user.remove()
        res.json({ message: 'Deleted Subscriber' })
    } catch(err) {
        res.status(500).json({ message: err.message })
    }
})

// Create
router.post('/', verifyToken, async (req, res) => {

    jwt.verify(req.token, 'werwldfs;jkngljks', async (err, authData) => {
        if(err) {
            res.status(403)
        } else {
            const user = new User({
                name: req.body.name,
                userId: req.body.userId,
                miles: req.body.miles
            })
        
            try {
                const newUser = await user.save()
                res.status(201).json(newUser, authData)
            } catch(err) {
                res.status(400).json({ message: err.message })
            }
        }
    });
})

async function getUser(req, res, next) {
    let user
    try {
        user = await User.findOne({ userId: req.params.id})
        if (user === null) {
            return res.status(404).json({ message:"Could not find User" })
        }
    } catch(err) {
        return res.status(500).json({ message: err.message })
    }

    res.user = user
    next()
} 

function verifyToken(req, res, next) {
    const heading = req.headers['Authorization']

    if(typeof heading !== 'undefined') {
        const bearer = heading.split(' ');
        const token = bearer[1];
        req.token = token
        next()
    } else {
        res.status(403)
    }
}

module.exports = router
