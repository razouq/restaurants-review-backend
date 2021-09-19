import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/decorators/public.decorator';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cloudinary = require('cloudinary').v2;
import streamifier from 'streamifier';

@Controller('files')
export class FilesController {
  @Public()
  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  async upload(@UploadedFiles() files: Array<Express.Multer.File>) {
    cloudinary.config({
      cloud_name: 'db1waj76f',
      api_key: '571181221445538',
      api_secret: 'Ux1KqcyBG-eqXokk_PhfJBylqWo',
    });

    const filesIds = [];
    const uploadImage = () => {
      return new Promise((resolve) => {
        files.forEach(async (file) => {
          cloudinary.uploader
            .upload_stream({ resource_type: 'image' }, cloudinaryDone)
            .end(file.buffer);

          function cloudinaryDone(error, result) {
            if (error) {
              console.log(
                'Error in cloudinary.uploader.upload_stream\n',
                error,
              );
              return;
            }
            console.log('Cloudinary url', result.url);
            filesIds.push(result.url);
            resolve(result.url);
          }
        });
      });
    };

    await uploadImage();

    return filesIds;
  }
}
