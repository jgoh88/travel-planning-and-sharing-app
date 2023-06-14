const multer = require('multer')
const cloudinary = require('cloudinary').v2
const DatauriParser = require('datauri/parser')
require('dotenv').config()

const storage = multer.memoryStorage()
const upload = multer({storage: storage})

const parser = new DatauriParser()
const bufferToDataURI = (fileFormat, buffer) => {
    return parser.format(fileFormat, buffer)
}

let cloudinaryFolder = 'GAProject2TravelPlanningApp'

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secure: true,
})

const setCloudinaryFolder = (folderName) => {
    cloudinaryFolder = `GAProject2TravelPlanningApp/${folderName}`
}

const uploadToCloudinary = async (fileString, format) => {
    try {
        const {uploader} = cloudinary
        const res = await uploader.upload(`data:image/${format};base64,${fileString}`, {folder: cloudinaryFolder})

        return res
    } catch (err) {
        console.log(err)
    }
}

const uploadImage = async (file) => {
    try {
        // const {file} = req
        const fileFormat = file.mimetype.split('/')[1]
        const {base64} = bufferToDataURI(fileFormat, file.buffer)

        const imageDetails = await uploadToCloudinary(base64, fileFormat)

        return imageDetails
    } catch (err) {
        console.log(err)
    }
}

module.exports = {upload, uploadImage, setCloudinaryFolder}