'use strict'

const cloudinary = require('../config/cloudinary.config')
const {s3, PutObjectCommand, GetObjectCommand,} = require('../config/s3.config')
// const {getSignedUrl} = require('@aws-sdk/s3-request-presigner')
const { getSignedUrl } = require("@aws-sdk/cloudfront-signer");
const { randomImageName } = require('../utils');
const urlImagePublic = "https://d1qwqk07de0ok6.cloudfront.net";

class UploadFileService {

    // 1. upload from url image
    async uploadFromUrl() {
        try {
            console.log(process.env.CLOUDINARY_API_KEY);
            console.log("thucc hien upload image")
            const urlImage = 'https://cdn.donmai.us/original/be/10/__koiwai_yotsuba_and_ayase_fuuka_yotsubato_drawn_by_iefukurou__be1070b815f0a393eb1deb1de08fe578.png';
            const folderName = 'product/shopId'
            const newFileName = 'Yotsuba_1'

            const result = await cloudinary.uploader.upload(urlImage, {
                folder: folderName,

            })
            console.log("result is ",result)
            return result;
        } catch (error) {
            console.error('Error uploading images',error)
        }
    }

    async uploadImageFromLocal({
        path,
        folderName = 'product/8849'
    }) {
        try {
            console.log(path);
            const result = await cloudinary.uploader.upload(path, {
                public_id: 'thumb',
                folder: folderName
            })
            console.log(result);
            return  {
                image_url: result.secure_url,
                shopId: 8409,
                thumb_url: await cloudinary.url(result.public_id, {
                    height: Math.floor(result.height / 3),
                    width: Math.floor(result.width / 3)
                })
            }
        } catch (error) {
            console.error('Error uploading images',error)
        }
    }

    // 3. upload from multiple images local
    async uploadImagesFromLocal({
        files,
        folderName = 'product/8849'
    }) {
        try {
            console.log(files);
            if (!files.length) return;
            const uploadedUrls = [];
            for (const file of files) {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: folderName
                })
                uploadedUrls.push( {
                    image_url: result.secure_url,
                    shopId: 8409,
                    thumb_url: await cloudinary.url(result.public_id, {
                        height: Math.floor(result.height / 3),
                        width: Math.floor(result.width / 3)
                    })
                })
            }

            return uploadedUrls
        } catch (error) {
            console.error('Error uploading images',error)
        }
    }


    //--------------- UPLOAD FILE USE S3 CLIENT---------------///
    
    async uploadImageFromLocalS3({
        file
    }) {
        try {
            const imageName = randomImageName();
            const command = new PutObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: imageName,
                Body: file.buffer,
                ContentType: 'image/jpeg' // default 
            })
            const result = await s3.send(command);



            const signedUrl = new GetObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: imageName,
            })
            const url = await getSignedUrl(s3, signedUrl, {expiresIn:3600});


            return {
                url: `${urlImagePublic}/${imageName}`,
                result
            }
        } catch (error) {
            console.error('Error uploading image using s3 client',error)
        }
    }

    async uploadImageFromLocalS3_CloudFront({
        file
    }) {
        try {
            const imageName = randomImageName();
            const command = new PutObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: imageName,
                Body: file.buffer,
                ContentType: 'image/jpeg' // default 
            })
            const result = await s3.send(command);

            const url = getSignedUrl({
                url: `${urlImagePublic}/${imageName}`,
                keyPairId: `${process.env.KEY_PAIR_ID}`,
                dateLessThan: new Date(Date.now()+ 1000*60),
                privateKey: process.env.AWS_BUCKET_PRIVATE_KEY_ID
            })


            return {
                url,
                result
            }
        } catch (error) {
            console.error('Error uploading image using s3 client',error)
        }
    }

}
module.exports = new UploadFileService();