class AppError extends Error {
  constructor(err, statusCode) {
    super(err);
    this.statusCode = statusCode;
  }

  toJSON() {
    return {
      err: this.message,
      statusCode: this.statusCode,
    };
  }
}

export default AppError;
