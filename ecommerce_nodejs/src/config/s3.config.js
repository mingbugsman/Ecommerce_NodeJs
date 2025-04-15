'use strict'
const { S3Client,PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3')

const s3Config = {
    region: "ap-southeast-2",
    credentials: {
        accessKeyId: process.env.AWS_BUCKET_ACCESS_KEY,
        secretAccessKey: process.env.AWS_BUCKET_SECRET_KEY
    }
}
const s3 = new S3Client(s3Config)
module.exports = {
    s3, PutObjectCommand, GetObjectCommand, DeleteObjectCommand
}; 