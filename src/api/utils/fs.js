const { s3 } = require('../../config/aws');
const { awsConfig } = require('../../config/vars');

exports.createPresignedUrls = (rootPath, files) => {
  const promises = [];
  const signedUrlExpiresSeconds = 60 * 60;

  const createURLPromise = (key, contentType, isPublic) =>
    new Promise((resolve, reject) => {
      s3.createPresignedPost(
        {
          Bucket: awsConfig.s3BucketName,
          Expires: signedUrlExpiresSeconds,
          Fields: {
            key,
            'Content-Type': contentType,
            acl: isPublic ? 'public-read' : 'authenticated-read',
          },
        },
        (err, data) => {
          if (err) reject(err);
          else resolve(data);
        },
      );
    });

  files.forEach((file) => {
    const Key = rootPath + file.name;
    promises.push(createURLPromise(Key, file.type, file.public));
  });

  return Promise.all(promises);
};

exports.removeFiles = filePaths => new Promise((resolve, reject) => {
  s3.deleteObjects(
    {
      Bucket: awsConfig.s3BucketName,
      Delete: {
        Objects: filePaths.map(Key => ({
          Key,
        })),
      },
    },
    (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    },
  );
});
