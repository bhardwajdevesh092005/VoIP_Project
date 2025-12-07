export const asyncHandler = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next);
    } catch (error) {
        console.log(error);
        const statusCode = error.code || error.statusCode || 500;
        res.status(statusCode).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};
