import { Inject, Injectable } from '@nestjs/common';
import { CLOUDINARY } from './cloudinary.constants';
import { v2 as Cloudinary, UploadApiResponse } from 'cloudinary';

@Injectable()
export class UploadService {
  constructor(
    @Inject(CLOUDINARY)
    private readonly cloudinary: typeof Cloudinary,
  ) {}

  async uploadImages(
    files: Express.Multer.File[],
    folder: string,
  ): Promise<UploadApiResponse[]> {
    const uploadPromises = files.map(async (file) => {
      const result = await this.cloudinary.uploader.upload(file.path, {
        folder,
      });
      return result;
    });
    return Promise.all(uploadPromises);
  }

  async removeImages(urls: string[]): Promise<void> {
    const publicIds = urls.map((url) => url.split('/').pop()!.split('.')[0]);
    const removePromises = publicIds.map(async (publicId) => {
      await this.cloudinary.uploader.destroy(publicId);
    });
    await Promise.all(removePromises);
    return;
  }
}
