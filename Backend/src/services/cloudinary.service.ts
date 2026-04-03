import cloudinary from 'cloudinary';
import fs from 'fs';
const cloudinaryObject = cloudinary.v2;

cloudinaryObject.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
    api_key: process.env.CLOUDINARY_API_KEY || '',
    api_secret: process.env.CLOUDINARY_API_SECRET || '',
});

export const uploadToCloudinary = async (filePath: string) => {
    try {
        const result = await cloudinaryObject.uploader.upload(filePath);
        fs.unlinkSync(filePath);
        return {err: null, res: result};
    } catch (error) {
        return {err: error, res: null};
    }
};