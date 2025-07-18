export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileExtension = (filename: string): string => {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
};

export const isImageFile = (file: File | string): boolean => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'webp', 'avif', 'bmp', 'gif'];
  const extension =
    typeof file === 'string'
      ? getFileExtension(file).toLowerCase()
      : getFileExtension(file.name).toLowerCase();
  return imageExtensions.includes(extension);
};
