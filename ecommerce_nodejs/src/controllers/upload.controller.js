'use strict'

const { BadRequestError } = require("../middleware/core/error.response")
const { SuccessResponse } = require("../middleware/core/success.response")
const uploadFileService  = require("../services/upload.service")


class UploadController {
    uploadFromUrl = async (req, res ,next) => {
        new SuccessResponse({
            message: "Successfull upload url image",
            metadata: await uploadFileService.uploadFromUrl()
        }).send(res)
    }

    uploadFileThumb = async (req, res ,next) => {
        
        const {file} = req;
        console.log(file.path);
        if (!file) {
            throw new BadRequestError("file is not existed")
        }
        new SuccessResponse({
            message: "Successfull upload local image",
            metadata: await uploadFileService.uploadImageFromLocal({
                path: file.path 
            })
        }).send(res)
    }

    uploadMultipleFileImages = async (req,res,next) =>{
        const {files} = req;
        if (!files.length) {
            throw new BadRequestError("Files missing")
        }
        new SuccessResponse({
            message: "upload successfully uploaded",
            metadata: await uploadFileService.uploadImagesFromLocal({
                files
            })
        }).send(res)
    }


    //----------------------- S3 UPLOAD CONTROLLER ------------------- //
    uploadFileThumb_S3 = async (req,res,next) => {
        const {file} = req;
        if (!file) {
            throw new BadRequestError("File missing")
        }
        new SuccessResponse({
            message: "Successfully upload file by s3 client",
            metadata: await uploadFileService.uploadImageFromLocalS3_CloudFront({
                file
            })
        }).send(res)
    }
}

module.exports = new UploadController();