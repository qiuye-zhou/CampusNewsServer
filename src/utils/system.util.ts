import { statSync } from 'fs';

export const getFileSize = (filePath: string) => {
  try {
    const stats = statSync(filePath);
    const fileSizeInBytes = stats.size;
    const fileSizeInKilobytes = fileSizeInBytes / 1024;
    return fileSizeInKilobytes.toFixed(2) + ' KB';
  } catch (error) {
    return 'N/A';
  }
};
