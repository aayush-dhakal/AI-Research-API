const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next); // this is used for global error handling. when error occures it passes to errorHandler middleware defined in server.js at last route

module.exports = asyncHandler;
