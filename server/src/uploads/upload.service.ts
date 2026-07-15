import { Inject, Injectable } from '@nestjs/common';
import { CLOUDINARY } from './cloudinary.constants';
import { v2 as Cloudinary } from 'cloudinary';

@Injectable()
export class UploadService {
  constructor(
    @Inject(CLOUDINARY)
    private readonly cloudinary: typeof Cloudinary,
  ) {}

  async uploadImages(
    files: Express.Multer.File[],
    folder: string,
  ): Promise<string[]> {
    const uploadPromises = files.map(async (file) => {
      const result = await this.cloudinary.uploader.upload(file.path, {
        folder,
      });
      return result.secure_url;
    });
    return Promise.all(uploadPromises);
  }
}
