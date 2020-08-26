import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

const tempFolder = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  tempFolder,
  uploadsFolder: path.resolve(tempFolder, 'uploads'),

  storage: multer.diskStorage({
    destination: tempFolder,
    filename: (request, file, callback) => {
      const hashname = crypto.randomBytes(10).toString('HEX');
      const filename = `${hashname}-${file.originalname}`;

      return callback(null, filename);
    },
  }),
};
