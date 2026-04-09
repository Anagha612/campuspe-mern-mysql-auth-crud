const errorHandler = (err, _req, res, _next) => {
  console.error(err);

  if (res.headersSent) {
    return;
  }

  return res.status(err.statusCode || 500).json({
    message: err.message || "Internal server error"
  });
};

module.exports = errorHandler;
