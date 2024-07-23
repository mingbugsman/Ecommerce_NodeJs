'use strict'

const reasonPhrases = require("../../utils/reasonPhrases");
const statusCodes = require("../../utils/statusCodes");



class SuccessResponse {
    constructor({message,statusCode = statusCodes.OK, reasonStatusCode= reasonPhrases.OK, metadata = {} }) {
        this.message= !message ? reasonStatusCode : message;
        this.status = statusCode,
        this.metadata = metadata
    }
    send(res,headers = {}) {
        return res.status(this.status).json(this)
    }
}

class OK extends SuccessResponse {
    constructor({message, metadata}) {
        super(message,metadata);
    }
}
class CREATED extends SuccessResponse {
    constructor({message,statusCode = statusCodes.CREATED ,reasonStatusCode= reasonPhrases.CREATED,metadata, options}) {
        super({message,statusCode,reasonStatusCode,metadata});
        this.options = options
    }
}

module.exports = {
    OK,CREATED, SuccessResponse
}