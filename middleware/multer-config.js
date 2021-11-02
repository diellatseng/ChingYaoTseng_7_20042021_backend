const multer = require('multer');
const path = require('path');

// Accepts only the following types of images
const validMimeTypes = [
    'image/jpg',
    'image/jpeg',
    'image/png',
    'image/gif'
]
// Multer option object
const saveImageToStorage = {
    storage: multer.diskStorage({
        // Set the folder to which the file has been saved
        destination: (req, file, callback) => { callback(null, './images') },
        // Rename file
        filename: (req, file, callback) => {
            const name = file.originalname.toLowerCase().split(' ').join('_').split('.')[0];                      //make sure that any space in file name will be replaced by "_"
            const extension = path.extname(file.originalname);
            callback(null, name + Date.now() + extension);
        }
    }),
    // Function to control which files are accepted
    fileFilter: (req, file, callback) => {
        if (validMimeTypes.includes(file.mimetype)) {
            callback(null, true)
        } else {
            callback(new Error('Invalid file type! Accepts only .png, .jpg, .jpeg and .gif extensions.'), false);
        }
    }
}

module.exports = multer(saveImageToStorage).single('file');