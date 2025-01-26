import multer from 'multer';
// @ts-ignore
import nextConnect from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next';

interface MulterRequest extends NextApiRequest {
  file?: Express.Multer.File;
};

const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

const handler = nextConnect<MulterRequest, NextApiResponse>({
  onError: (err: Error, req: MulterRequest, res: NextApiResponse) => {
    res.status(500).end(err.toString());
  },
  onNoMatch: (req: MulterRequest, res: NextApiResponse) => {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  },
});

handler.use(upload.single('audio'));

handler.post((req: MulterRequest, res: NextApiResponse) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.status(200).json({
    message: 'File uploaded successfully',
    file: req.file,
  });
});

export default handler; 
