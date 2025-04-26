import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import { File } from 'multer';

@Injectable()
export class UploadService {
  constructor(private configService: ConfigService) {
    // Configure Cloudinary using the injected config
    cloudinary.config({
      cloud_name: this.configService.get<string>('cloudinary.cloud_name'),
      api_key: this.configService.get<string>('cloudinary.api_key'),
      api_secret: this.configService.get<string>('cloudinary.api_secret'),
    });
  }

  async uploadImage(file: File): Promise<UploadApiResponse> {
    const image = new Promise<UploadApiResponse>((resolve, reject) => {
      // Check if file is provided and is an image
      if (!file || !file.mimetype.startsWith('image/')) {
        console.error('Invalid file type:', file); // Log the invalid file type
        return reject(new InternalServerErrorException('Invalid file type. Please upload an image.'));
      }
      // configure cloudinary and Upload the image to Cloudinary
      console.log('Uploading image to Cloudinary...'); // Log the upload process

      cloudinary.uploader.upload_stream({ resource_type: 'image' }, (err, result) => {
        if (err) {
          console.error('Error uploading image to Cloudinary:', err); // Log the error
          return reject(
            new InternalServerErrorException('Failed to upload image. Please try again later.')
          );
        }
        if (result) {
          resolve(result as UploadApiResponse); // Type assertion to UploadApiResponse
        } else {
          reject(new InternalServerErrorException('Invalid response from Cloudinary.'));
        }
      }).end(file.buffer);
    }).catch((error) => {
      // Handle any unexpected errors
      console.error('Unexpected error during image upload:', error);
      throw new InternalServerErrorException('An unexpected error occurred during image upload.');
    });

    return image; // Return the promise
  }

  async uploadImageToCloudinary(file: File): Promise<UploadApiResponse> {
    try {
      const result = await this.uploadImage(file);
      return result;
    } catch (error) {
      console.error('Error in uploadImageToCloudinary:', error); // Log the error
      throw error; // Rethrow the error to be handled by the caller
    }
  }


}
