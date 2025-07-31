const asyncHandler = require('express-async-handler');
const cloudinary = require('../config/cloudinary');

const generateUploadSignature = asyncHandler(async (req, res) => {
  const timestamp = Math.round(new Date().getTime() / 1000);

  // For good practice, let's put all images into a 'faqeera' folder
  const folder = 'faqeera'; 
  const eager = 'c_fill,h_700,w_700';
  
  // THE FIX: The parameters to sign MUST be in a single object.
  // The Cloudinary SDK will automatically handle sorting these alphabetically
  // before creating the signature string (eager, then folder, then timestamp).
  const paramsToSign = {
    timestamp: timestamp,
    eager: eager,
    folder: folder
  };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET
  );

  res.json({
    timestamp,
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    folder: folder, // Also send the folder name to the frontend
    eager: eager   // And the eager transformation
  });
});

module.exports = { generateUploadSignature };