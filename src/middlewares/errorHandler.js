// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  // Log the error
  req.log.error(err);
  // Respond with a 500 status code
  res.status(500).send({
    // message: err.message ?? 'Internal Server Error',
    message: 'Internal Server Error',
    status: err.status ?? 500,
  });
};
