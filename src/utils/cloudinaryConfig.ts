
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name:'djxxetgwi',
  api_key:'471826219791146',
  api_secret:'Hy9UTMQjN3UuT8CzJIIc9sukVaQ',
});

export default cloudinary;

// import { v2 as cloudinary } from "cloudinary";
// import { CloudinaryStorage } from "multer-storage-cloudinary";
// import multer from "multer";

// cloudinary.config({
//   cloud_name: 'djxxetgwi',
//   api_key:'471826219791146',
//   api_secret: 'Hy9UTMQjN3UuT8CzJIIc9sukVaQ',
// });

// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: async (req, file) => {
//     return {
//       folder: "student-profiles", // ✅ Now valid
//       public_id: `${Date.now()}-${file.originalname}`,
//       resource_type: "image",
//       allowed_formats: ["jpg", "jpeg", "png"],
//     };
//   },
// });

// const upload = multer({ storage });

// export default upload;



