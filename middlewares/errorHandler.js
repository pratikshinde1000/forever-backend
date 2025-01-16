const errorHandler = (async (error, req, res, next) => {
    // const error = await err;
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server error';
    return res.status(statusCode).json({ success: false, error: message })
})

export default errorHandler;