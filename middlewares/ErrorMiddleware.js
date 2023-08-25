const errorMiddleware = (err, req, res, next) => {
  const response = { message: err.message }
  const status = err.status || 500
  res.status(status).send(response)
}

export default errorMiddleware
