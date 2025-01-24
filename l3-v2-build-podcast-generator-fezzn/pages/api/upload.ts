// import multer from 'multer';
// import nextConnect, { NextHandler } from 'next-connect';
// import type { NextApiRequest, NextApiResponse } from 'next';

// const storage = multer.diskStorage({
//   destination: './uploads',
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });

// const upload = multer({ storage });

// const handler = nextConnect();

// handler.use(upload.single('audio'))
//   .post((req, res) => {
//     if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
//     res.status(200).json({ message: 'File uploaded successfully', file: req.file });
//   });

// export default handler;

import multer from 'multer'; 
import nextConnect, { NextHandler } from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next';

// Extend NextApiRequest to include Multer's file property
interface MulterRequest extends NextApiRequest {
  file?: Express.Multer.File;
}

const storage = multer.diskStorage({
  destination: './uploads', // Save files in the "uploads" folder
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Use the original filename
  },
});

const upload = multer({ storage });

const handler = nextConnect<MulterRequest, NextApiResponse>();

// Add multer middleware to handle single file upload
handler.use(upload.single('audio'));

// Handle POST requests
handler.post((req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.status(200).json({
    message: 'File uploaded successfully',
    file: req.file,
  });
});

export default handler;
