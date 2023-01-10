// const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')


const errorHandlerMiddleware = (err, req, res, next) => {

  // set default
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong try again later",
  }


  // Custom error above works fine for all
  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }

  // Validation Error
  if (err.name === "ValidationError") {
    customError.msg = Object.values(err.errors).map((item) => item.message).join(',')
    customError.statusCode = 400
  }

  // Duplicate Error
  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value for ${Object.keys(err.keyValue)} field, please choose another value`
    customError.statusCode = 400
  }

  // Cast Error
  if (err.name === "CastError") {
    customError.msg = `No item found with id : ${err.value}`
    customError.statusCode = 404
  }

  return res.status(customError.statusCode).json({ msg: customError.msg })
  //return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
}

module.exports = errorHandlerMiddleware