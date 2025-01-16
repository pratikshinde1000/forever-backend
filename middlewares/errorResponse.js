const errorResponse = async (statusCode=500, errorMessage='Internal Server Error') => {
    const error = new Error();
    error.statusCode = statusCode;
    error.message = errorMessage;
    return error;
}

export default errorResponse;