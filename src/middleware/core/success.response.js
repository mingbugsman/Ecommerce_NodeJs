'use strict'


const StatusCode = {
    OK : 200,
    CREATED : 201
};

const ReasonStatusCode = {
    OK : "Created",
    CREATED : "Success"
};
class SuccessResponse {
    constructor({message,statusCode = StatusCode.OK,reasonStatusCode= ReasonStatusCode.OK, metadata = {} }) {
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
    constructor({message,statusCode = StatusCode.CREATED ,reasonStatusCode= ReasonStatusCode.CREATED,metadata}) {
        super({message,statusCode,reasonStatusCode,metadata});
    }
}

module.exports = {
    OK,CREATED
}