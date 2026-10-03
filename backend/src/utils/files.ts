import {
  access,
  copyFile,
  mkdir,
  rm,
} from 'fs/promises';
import path from 'path';
import { UPLOAD_PATH, UPLOAD_PATH_TEMP } from '../config';

const imagesDir = path.join(__dirname, '..', 'public', UPLOAD_PATH);

export const tempDir = path.join(__dirname, '..', UPLOAD_PATH_TEMP);

export const imageFileNamePattern = new RegExp(`^/${UPLOAD_PATH}/\\w[\\w.-]*$`);

export const getImageUrl = (name: string) => `/${UPLOAD_PATH}/${name}`;

const exists = (filePath: string) => access(filePath).then(() => true, () => false);

export const copyImageFromTemp = async (fileName: string) => {
  const name = path.basename(fileName);
  const tempPath = path.join(tempDir, name);
  if (!(await exists(tempPath))) {
    return;
  }

  await mkdir(imagesDir, { recursive: true });
  await copyFile(tempPath, path.join(imagesDir, name));
  await rm(tempPath, { force: true });
};

export const removeImage = (fileName: string) => rm(
  path.join(imagesDir, path.basename(fileName)),
  { force: true },
);
