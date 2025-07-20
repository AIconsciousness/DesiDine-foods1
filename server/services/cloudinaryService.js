// TODO: Integrate multer and cloudinary SDK
exports.uploadImage = async (file) => {
  // Dummy: In real app, upload to Cloudinary
  console.log('Uploading image:', file?.originalname || file);
  return { url: 'https://dummyimage.com/600x400/000/fff&text=Demo+Image' };
}; 