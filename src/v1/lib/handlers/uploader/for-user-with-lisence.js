
//@ts-check

import multer from 'multer';
import {v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: "house-interior",
    api_key: "244144477296673",
    api_secret: "X8tWIKx4cjgsfv0bIJ-6H7ew4ak",
    secure: true
});


function ProductStorageEngine () {}

ProductStorageEngine.prototype._handleFile = function _handleFile (req, file, cb) {
    file.stream.pipe(cloudinary.uploader.upload_stream(function (error, result) {
        if (error) {
            return cb(error);
        }
        if (file.fieldname === 'license') {
            cb(null, {
                lisencePath: result.url
            });
        } else {
            cb(null, {
                imagePath: result.url
            });
        }
    }));                        
}

ProductStorageEngine.prototype._removeFile = function _removeFile (req, file, cb) {
    console.log(file)
    cloudinary.uploader.destroy(file.filename, function (error, result) {
        if (error) {
            return cb(error);
        }
        cb(null, result);
    });
}

const productsStorage = new ProductStorageEngine();

const  userWithLisenseUploader = multer({ storage: productsStorage }).fields([
    { name: 'crew_image', maxCount: 10 },
    { name: 'license', maxCount: 8 }
  ]);

export default userWithLisenseUploader;