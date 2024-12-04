const AWS = require("aws-sdk");
require("dotenv").config(); // Load environment variables

console.log("AWS_ACCESS_KEY_ID:", process.env.IAM_user_key);
console.log("AWS_SECRET_ACCESS_KEY:", process.env.IAM_user_secret);
console.log("BUCKET_NAME:", process.env.BUCKET_NAME);

const uploadToS3 = (data, filename) => {
  const BUCKET_NAME = process.env.BUCKET_NAME;
  const IAM_USER_KEY = process.env.IAM_user_key; // Corrected variable name
  const IAM_SECRET_KEY = process.env.IAM_user_secret; // Corrected variable name

  let s3bucket = new AWS.S3({
    region: "eu-north-1",
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_SECRET_KEY,
  });

  var params = {
    Bucket: BUCKET_NAME,
    Key: filename,
    Body: data,
    ACL: "public-read",
  };

  console.log(params);
  return new Promise((resolve, reject) => {
    s3bucket.upload(params, (err, s3response) => {
      if (err) {
        console.log("Something went wrong in s3bucket upload");
        reject(err);
      } else {
        console.log("Success upload s3bucket", s3response);
        resolve(s3response.Location);
      }
    });
  });
};

console.log("AWS Config:", AWS.config.credentials);
module.exports = { uploadToS3 };
