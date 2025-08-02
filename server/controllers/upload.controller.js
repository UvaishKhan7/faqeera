const asyncHandler = require('express-async-handler');
const cloudinary = require('../config/cloudinary');

const generateUploadSignature = asyncHandler(async (req, res) => {
  const timestamp = Math.round(Date.now() / 1000);
  const folder = 'faqeera'; 
  const eager = 'c_fill,h_700,w_700';

  const paramsToSign = {
    timestamp,
    eager,
    folder
  };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET
  );

  res.status(200).json({
    timestamp,
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    folder,
    eager
  });
});

module.exports = { generateUploadSignature };
