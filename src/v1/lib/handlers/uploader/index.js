//@ts-check

import multer from 'multer';
import {v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: "house-interior",
    api_key: "244144477296673",
    api_secret: "X8tWIKx4cjgsfv0bIJ-6H7ew4ak",
    secure: true
});
  
function MyCustomStorage () {}

MyCustomStorage.prototype._handleFile = function _handleFile (req, file, cb) {
    file.stream.pipe(cloudinary.uploader.upload_stream(function (error, result) {
        if (error) {
            return cb(error);
        }
        // console.log(result);
        cb(null, {
            imagePath: result.url
        });
    }));                        
}

MyCustomStorage.prototype._removeFile = function _removeFile (req, file, cb) {
    cloudinary.uploader.destroy(file.filename, function (error, result) {
        if (error) {
            return cb(error);
        }
        cb(null, result);
    });
}

const storage = new MyCustomStorage();


const multerUploads = multer({ storage }).array('image', 12);

export default multerUploads;




