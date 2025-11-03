
import { FileInterceptor } from '@nestjs/platform-express';

export const imageFileInterceptor = FileInterceptor('image', {
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.match(/^image\/(jpeg|png|webp)$/)) {
      cb(new Error('Solo se permiten imágenes (jpeg, png, webp)'), false);
    } else {
      cb(null, true);
    }
  },
});
