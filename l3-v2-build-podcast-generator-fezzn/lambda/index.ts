import { Handler } from 'aws-lambda';
const { exec } = require('child_process');
const { NextApiRequest, NextApiResponse } = require('next');
const fs = require('fs');
const path = require('path');
const { S3Client, GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { apiHealthCheck, transcribeWithGemini } = require('./utils');

const s3Client = new S3Client({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
});

function runCommand(command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // @ts-expect-error: exec type
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Command failed: ${stderr}`);
        reject(error);
      } else {
        console.log(`Command succeeded: ${stdout}`);
        resolve(stdout);
      }
    });
  });
};

export const handler: Handler = async (req: typeof NextApiRequest, res: typeof NextApiResponse) => {
  if (req.method !== 'POST') return res.status(405).end(`Method ${req.method} Not Allowed`);

  const { inputKey, outputKey } = req.body;

  if (!inputKey || !outputKey) return res.status(400).json({ error: 'Input and/or output key is missing.' });
  const inputFilePath = `/tmp/${path.basename(inputKey)}`;
  const outputFilePath = `/tmp/${path.basename(outputKey)}`;

  try {
    const result = await processAudio(inputKey, outputKey);

    res.status(200).json(result);
  } catch (error) {
    console.error('Error processing audio:', error);
    // @ts-expect-error: error type
    res.status(500).json({ error: error.message });
  } finally {
    // Clean up
    if (fs.existsSync(inputFilePath)) fs.unlinkSync(inputFilePath);
    if (fs.existsSync(outputFilePath)) fs.unlinkSync(outputFilePath);
  }
};

async function processAudio(inputKey: string, outputKey: string) {
  const inputFilePath = `/tmp/${path.basename(inputKey)}`;
  const outputFilePath = `/tmp/${path.basename(outputKey)}`;

  await apiHealthCheck();

  // Download input from S3
  const inputFileCommand = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: inputKey,
  });
  const inputFileResponse = await s3Client.send(inputFileCommand);

  // Save the file locally
  const inputStream = inputFileResponse.Body as ReadableStream;
  const inputFileWriteStream = fs.createWriteStream(inputFilePath);
  // @ts-expect-error: not sure what type goes here
  inputStream.pipe(inputFileWriteStream);

  await new Promise((resolve) => inputFileWriteStream.on('finish', resolve));

  const command = `ffmpeg -i ${inputFilePath} ${outputFilePath}`;

  await runCommand(command);

  // Upload to S3
  const processedFileStream = fs.createReadStream(outputFilePath);
  const uploadCommand = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: outputKey,
    Body: processedFileStream,
    ContentType: 'audio/mpeg',
    ACL: 'public-read', // Allow public access to processed file
  });

  await s3Client.send(uploadCommand);

  // Signed URL for the processed file
  const signedUrl = await getSignedUrl(
    s3Client,
    new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: outputKey,
    }),
    { expiresIn: 3600 } // 1 hour
  );

  await apiHealthCheck();

  const transcription = await transcribeWithGemini(signedUrl);

  return {
    message: 'Audio processing complete',
    fileUrl: signedUrl,
    transcription: transcription
  };
};
