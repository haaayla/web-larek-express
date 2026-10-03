import dotenv from 'dotenv';

dotenv.config();

const getEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Переменная окружения ${name} не задана`);
  }
  return value;
};

export const PORT = getEnv('PORT');
export const DB_ADDRESS = getEnv('DB_ADDRESS');
