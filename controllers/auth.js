const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const {UnauthenticatedError, BadRequestError } = require('../errors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const register = async(req, res) => {
    const {name, email, password} = req.body;
    
    // Validate user inputs
    if (!name || !email || !password) {
        throw new BadRequestError("Please provide name, email, and password")
    }

    // Password hash
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)

    const tempUser = {name, email, password: hashPassword}
    const user = await User.create({...tempUser})
    // const token = jwt.sign({ userId: user._id, name: user.name }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME })
    // res.status(StatusCodes.CREATED).json({user: {name: user.name,}, token: token})
    res.status(StatusCodes.CREATED).json({user: {name: user.name,}, token: createJWT(user)})
}

const login = async(req, res) => {
    const {email, password} = req.body;
    
    // Validate user inputs
    if ( !email || !password ) {
        throw new BadRequestError("Please provide email, and password")
    }

    // Check if user's email exist
    const user = await User.findOne({email})
    if (!user) {
        throw new UnauthenticatedError("Invalid Credentials")
    }


    const userPasswordCorrect = await comparePassword(password, user.password)
    if (!userPasswordCorrect) {
        throw new UnauthenticatedError("Check your password!")
    }


    // const token = user.createJWT({user})
    res.status(StatusCodes.OK).json({ user: {name: user.name}, token : createJWT(user)})

}


// Function to generate token for every users
const createJWT = (user) => {
    return jwt.sign({ userId: user._id, name: user.name }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME })
}

// Function to compare password from user and database password
const comparePassword = async(candidatePassword, password) => {
    const isMatch = await bcrypt.compare(candidatePassword, password)
    return isMatch;
}


module.exports = {
    register,
    login,
} 