import { randomUUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from '../constants';
import BadRequestError from '../errors/bad-request-error';
import { tempDir } from '../utils/files';

const getExtension = (mimetype: string) => mimetype.split('/')[1].replace('+xml', '');

const upload = multer({
  storage: multer.diskStorage({
    destination: tempDir,
    filename: (_req, file, cb) => cb(null, `${randomUUID()}.${getExtension(file.mimetype)}`),
  }),
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
      return cb(new BadRequestError('Недопустимый тип файла'));
    }
    return cb(null, true);
  },
  limits: { fileSize: MAX_FILE_SIZE },
  defParamCharset: 'utf8',
});

const uploadSingleFile = (req: Request, res: Response, next: NextFunction) => {
  upload.single('file')(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      const message = error.code === 'LIMIT_FILE_SIZE'
        ? 'Файл слишком большой'
        : 'Ошибка при загрузке файла';
      return next(new BadRequestError(message));
    }
    return next(error);
  });
};

export default uploadSingleFile;
