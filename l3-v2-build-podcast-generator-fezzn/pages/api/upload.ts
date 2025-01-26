import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import type { NextApiRequest, NextApiResponse } from 'next';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if ( req.method !== 'POST' ) return res.status(405).end(`Method ${ req.method } Not Allowed`);

  const { name, type } = req.body;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: name,
    ContentType: type,
    ACL: 'public-read', // or 'private'
  });

  try {
    const signedUrl = await getSignedUrl( s3Client, command, { expiresIn: 60 });
    res.status(200).json({ url: signedUrl });
  } catch (error) {
    // @ts-ignore
    res.status(500).json({ error: error.message });
  }
};

export default handler;
