import * as AWS from 'aws-sdk';
import { ReadStream } from 'fs';
import { v4 as uuidv4 } from 'uuid';

AWS.config.update({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const uploadToS3 = async (file, userId) => {
  const { filename, createReadStream } = await file;

  const regexFilename = filename.match(/(\w|-|_|\/)+./g);
  const fileExt = regexFilename[regexFilename.length - 1];

  const readStream: ReadStream = createReadStream();

  const upload = await new AWS.S3()
    .upload({
      // Body: 파일 스트림(stream)
      Body: readStream,
      // Bucket: 업로드할 버킷 이름(AWS S3 BUCKET)
      Bucket: 'instaclone-bucket',
      // Key: 업로드할 파일 이름 (폴더 경로로 입력가능!)
      Key: `${uuidv4()}.${fileExt}`,
      // ACL: 권한
      ACL: 'public-read',
    })
    .promise();
  return upload.Location;
};
