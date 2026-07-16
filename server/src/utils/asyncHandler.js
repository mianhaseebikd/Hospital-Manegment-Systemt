// To Make Common Async Handler for Routes
const asyncHandler = (requestHandler) => (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
};

export { asyncHandler };




// To Test This Code
// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next);
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: error.message || 'Some Thing Went Wrong',
//         });
//         next(error);
//     }
// };