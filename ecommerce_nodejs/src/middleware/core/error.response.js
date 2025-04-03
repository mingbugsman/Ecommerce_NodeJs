"use strict";

const reasonPhrases = require("../../utils/reasonPhrases");
const statusCodes = require('../../utils/statusCodes');
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

class AuthFailureError extends ErrorResponse {
  constructor(
    message = reasonPhrases.UNAUTHORIZED,
    status = statusCodes.UNAUTHORIZED
  ) {
    super(message,status);
  }
}

class NOTFOUNDERROR extends ErrorResponse {
  constructor (message = reasonPhrases.NOT_FOUND,status = statusCodes.NOT_FOUND) {
    super(message,status);
  }
}
class FORBIDDENERROR extends ErrorResponse {
  constructor(message = reasonPhrases.FORBIDDEN, stauts = statusCodes.FORBIDDEN) {
    super(message,stauts)
  }
}

class ErrorDiscount extends ErrorResponse {
  constructor(
    message = reasonPhrases.BAD_REQUEST,
    status = statusCodes.BAD_REQUEST
  ) {
    super(message,status);
  }
}

module.exports = {
  ConflictRequestError,
  BadRequestError,
  AuthFailureError,
  NOTFOUNDERROR,
  FORBIDDENERROR,
  ErrorDiscount
};
