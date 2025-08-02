import { Injectable, BadRequestException } from '@nestjs/common';
import { AppConfigService } from 'src/config/config.service';
import * as sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';

type FitEnum = 'cover' | 'contain' | 'fill' | 'inside' | 'outside';

export interface ImageUploadOptions {
  userId: string;
  file: Express.Multer.File;
  resizeOptions?: {
    width?: number;
    height?: number;
    fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  };
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
}

export interface ImageUploadResult {
  originalPath: string;
  compressedPath: string;
  filename: string;
  url: string;
  size: number;
}

@Injectable()
export class ImageService {
  constructor(private readonly configService: AppConfigService) {}

  /**
   * Upload and process an image
   */
  async uploadImage(options: ImageUploadOptions): Promise<ImageUploadResult> {
    const {
      userId,
      file,
      resizeOptions = { width: 500, height: 500, fit: 'inside' },
      quality = 80,
      format = 'jpeg',
    } = options;

    // Validate file
    this.validateImageFile(file);

    // Create user directory
    const userDir = this.createUserDirectory(userId);

    // Generate unique filename
    const filename = this.generateUniqueFilename(file.originalname);
    const compressedPath = path.join(userDir, filename);

    try {
      // Process image with Sharp
      await this.processImage(file.path, compressedPath, {
        resizeOptions,
        quality,
        format,
      });

      // Clean up original file
      this.cleanupOriginalFile(file.path);

      // Generate URL
      const baseUrl = this.configService.app.baseUrl as string;
      const url = `${baseUrl}/images/${userId}/${filename}`;

      // Get file size
      const stats = fs.statSync(compressedPath);
      const size = stats.size;

      return {
        originalPath: file.path,
        compressedPath,
        filename,
        url,
        size,
      };
    } catch (error) {
      // Clean up on error
      this.cleanupFile(compressedPath);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to process image: ${errorMessage}`);
    }
  }

  /**
   * Validate image file
   */
  private validateImageFile(file: Express.Multer.File): void {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Only image files are allowed (JPEG, PNG, GIF, WebP)',
      );
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size must be less than 5MB');
    }
  }

  /**
   * Create user directory
   */
  private createUserDirectory(userId: string): string {
    const userDir = path.join('assets', 'images', userId);

    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }

    return userDir;
  }

  /**
   * Generate unique filename with timestamp
   */
  private generateUniqueFilename(originalName: string): string {
    const date = new Date();
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    const timestamp = `${day}_${month}_${year}_${hours}_${minutes}_${seconds}`;
    const fileExtension = path.extname(originalName);

    return `${timestamp}${fileExtension}`;
  }

  /**
   * Process image with Sharp
   */
  private async processImage(
    inputPath: string,
    outputPath: string,
    options: {
      resizeOptions: { width?: number; height?: number; fit?: string };
      quality: number;
      format: string;
    },
  ): Promise<void> {
    const { resizeOptions, quality, format } = options;

    let sharpInstance = sharp(inputPath);

    // Apply resize if dimensions are provided
    if (resizeOptions.width || resizeOptions.height) {
      sharpInstance = sharpInstance.resize(
        resizeOptions.width,
        resizeOptions.height,
        {
          fit: resizeOptions.fit as FitEnum,
          withoutEnlargement: true,
        },
      );
    }

    // Apply format and quality
    switch (format) {
      case 'jpeg':
        sharpInstance = sharpInstance.jpeg({ quality });
        break;
      case 'png':
        sharpInstance = sharpInstance.png({ quality });
        break;
      case 'webp':
        sharpInstance = sharpInstance.webp({ quality });
        break;
      default:
        sharpInstance = sharpInstance.jpeg({ quality });
    }

    await sharpInstance.toFile(outputPath);
  }

  /**
   * Clean up original file
   */
  private cleanupOriginalFile(filePath: string): void {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  /**
   * Clean up file
   */
  private cleanupFile(filePath: string): void {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  /**
   * Delete user's image
   */
  deleteUserImage(userId: string, filename: string): void {
    const imagePath = path.join('assets', 'images', userId, filename);

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }

  /**
   * Get image info
   */
  async getImageInfo(imagePath: string): Promise<{
    width: number;
    height: number;
    size: number;
    format: string;
  }> {
    const metadata = await sharp(imagePath).metadata();
    const stats = fs.statSync(imagePath);

    return {
      width: metadata.width || 0,
      height: metadata.height || 0,
      size: stats.size,
      format: metadata.format || 'unknown',
    };
  }
}
