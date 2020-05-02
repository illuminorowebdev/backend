const httpStatus = require('http-status');
const fs = require('fs');
const path = require('path');

exports.getVideoStream = async (req, res, next) => {
  const {
    params: { uid },
    headers: { range },
  } = req;
  const videoPath = `./assets/videos/${uid}`;
  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    // eslint-disable-next-line no-mixed-operators
    const chunksize = end - start + 1;
    const file = fs.createReadStream(videoPath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    };

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(200, head);
    fs.createReadStream(videoPath).pipe(res);
  }
};

exports.getVideoThumbnail = async (req, res) => {
  const {
    params: { uid },
  } = req;
  console.log(uid, path.join(process.cwd(), '/assets/thumbnails/'));
  res.sendFile(uid, { root: path.join(process.cwd(), '/assets/thumbnails/') });
};

exports.getImage = (req, res) => {
  const {
    params: { uid },
  } = req;
  res.sendFile(uid, { root: './assets/images' });
};
