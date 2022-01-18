import AWS from "aws-sdk";

AWS.config.update({ region: process.env.AWS_REGION });

const s3 = new AWS.S3();
const URL_EXPIRATION_SECONDS = 300;

const getSignedUrl = async event => {
  const randomId = ~~(Math.random() * 100000000);
  const key = `all/${randomId}.jpg`;

  const s3Params = {
    Bucket: process.env.UploadBucket,
    Key: key,
    Expires: URL_EXPIRATION_SECONDS,
    ContentType: "image/jpeg"
  };

  console.log("Params: ", s3Params);

  const uploadUrl = await s3.getSignedUrlPromise("putObject", s3Params);

  return JSON.stringify({
    uploadUrl,
    key
  });
};

export const handler = async event => {
  return getSignedUrl(event);
};
