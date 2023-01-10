const { StatusCodes} = require('http-status-codes')
const Note = require('../models/Notes')
const {BadRequestError, NotFoundError} = require('../errors')


const getAllNotes = async(req, res) => {
    const notes = await Note.find({createdBy: req.user.userId}).sort('createdAt')
    res.status(StatusCodes.OK).json({ count: notes.length, notes})
}

const getNote = async(req, res) => {
    const {user: {userId}, params: {id: noteId}} = req

    const note = await Note.findOne({ _id: noteId, createdBy: userId})
    if (!note) {
        throw new NotFoundError(`No note with id ${noteId}`)
    }

    res.status(StatusCodes.OK).json({note})
}

const createNotes = async(req, res) => {
    req.body.createdBy = req.user.userId;
    const note = await Note.create(req.body)
    res.status(StatusCodes.OK).json({note})
}

const updateNotes = async(req, res) => {
    
    const {body: {title,description,author},user: {userId}, params: {id: noteId}} = req


    if (!title || !description || !author) {
        throw new BadRequestError('Title, description, or Author fields cannot be empty')
    }

    const note = await Note.findByIdAndUpdate({ _id: noteId, createdBy: userId}, req.body, {new:true, runValidators:true})
    if (!note) {
        throw new NotFoundError(`No note with id ${noteId}`)
    }

    res.status(StatusCodes.OK).json({note})

}

const deleteNotes = async(req, res) => {
   
    const {user: {userId}, params: {id: noteId}} = req

    const note = await Note.findByIdAndRemove({ _id: noteId, createdBy: userId})

    if (!note) {
        throw new NotFoundError(`No note with id ${noteId}`)
    }

    res.status(StatusCodes.OK).json({note})



}


module.exports = {
    getAllNotes,
    getNote,
    createNotes,
    updateNotes,
    deleteNotes
}