
import axios from 'axios';
import { uploadAPI } from './api';

/**
 * Uploads a file directly to Cloudinary using a backend-generated signature.
 * Allows bypassing Vercel file size limits.
 * 
 * @param {File} file - The file object from <input type="file" />
 * @param {string} resourceType - 'image' or 'video'
 * @param {string} folder - Target folder path (default: 'learning-platform')
 * @returns {Promise<string>} The secure_url of the uploaded file
 */
export const uploadToCloudinary = async (file: File, resourceType: 'image' | 'video' = 'image', folder: string = 'learning-platform') => {
  try {
    // 1. Get Signature from Backend
    const signatureResponse = await uploadAPI.getUploadSignature(folder);
    
    // Robust data extraction
    const data = signatureResponse.data.data || signatureResponse.data;
    const { signature, timestamp, cloudName, apiKey } = data;

    if (!signature || !timestamp || !cloudName || !apiKey) {
      throw new Error("Missing signature or configuration from backend");
    }

    // 2. Prepare Form Data for Cloudinary
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp.toString()); // Ensure string
    formData.append('signature', signature);
    formData.append('folder', folder);

    // 3. Upload to Cloudinary
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

    const uploadResponse = await axios.post(cloudinaryUrl, formData, {
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          // Potential future enhancement: expose progress via callback
        }
      }
    });

    console.log('Direct Upload Successful:', uploadResponse.data);
    return uploadResponse.data.secure_url;

  } catch (error) {
    console.error('Direct Upload failed:', error);
    throw error;
  }
};
