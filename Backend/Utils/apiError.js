class ApiError extends Error {
    constructor(
        code,
        message = "Something Went Wrong",
        errors = [],
        stack = ""
    ) {
        super(message);
        ((this.code = code),
            (this.message = message),
            (this.stack = stack),
            (this.errors = errors),
            (this.success = false));
        if (stack) {
            this.stack = stack;
        } else {
            this.stack = Error.captureStackTrace(this, this.constructor);
        }
    }
}

export {ApiError};
