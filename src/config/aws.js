const aws = require('aws-sdk');
const { awsConfig } = require('./vars');

aws.config.update({
  secretAccessKey: awsConfig.secretKey,
  accessKeyId: awsConfig.accessKey,
  region: awsConfig.s3Region,
});

const spacesEndpoint = new aws.Endpoint(awsConfig.s3EndPoint);
const s3 = new aws.S3({
  endpoint: spacesEndpoint,
});

module.exports = {
  aws,
  s3,
};
