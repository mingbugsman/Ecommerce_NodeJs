"use strict";

const StatusCode = {
  FORBIDDEN: 403,
  CONFLICT: 409,
};

const ReasonStatusCode = {
  FORBIDDEN: "Bad request error",
  CONFLICT: "CONFLICT ERROR",
};

class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.CONFLICT,
    status = StatusCode.CONFLICT
  ) {
    super(message, status);
  }
}


class BadRequestError extends ErrorResponse {
    constructor(
      message = ReasonStatusCode.FORBIDDEN,
      status = StatusCode.FORBIDDEN
    ) {
      super(message, status);
    }
}

module.exports = {
    ConflictRequestError,BadRequestError
}
  