import multer from 'multer';
import path from 'path';
const __dirname = path.resolve()
const uploadsPath = path.join(__dirname, "temp");
// Set storage engine
const storage = multer.diskStorage({
  destination: uploadsPath,
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
// Initialize upload
export const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }, // Limit file size to 10MB
  onError: function (err, next) {
    if (err) {
      console.error('Multer Error:', err);
      next(err);
    }
  },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
});

// Check file type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}