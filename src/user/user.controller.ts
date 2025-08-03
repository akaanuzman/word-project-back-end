import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UserService } from './user.service';
import { UserResponseDTO } from './DTOs/users.response';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiConsumes,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';

// Reusable file upload interceptor
const createFileUploadInterceptor = () => {
  return FileInterceptor('image', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const userId = req.params.id;
        const userDir = path.join('assets', 'images', userId);

        // Create directory if it doesn't exist
        if (!fs.existsSync(userDir)) {
          fs.mkdirSync(userDir, { recursive: true });
        }

        cb(null, userDir);
      },
      filename: (req, file, cb) => {
        // Use original filename for temporary storage
        cb(null, `temp_${Date.now()}_${file.originalname}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      const allowedMimeTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
      ];
      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(
          new BadRequestException(
            'Only image files are allowed (JPEG, PNG, GIF, WebP)',
          ),
          false,
        );
      }
    },
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
  });
};

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'Get all users',
    description: 'Returns a list of all users',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of all users',
    type: [UserResponseDTO],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Access token required',
  })
  @Get()
  async getUsers(): Promise<UserResponseDTO[]> {
    return this.userService.getUsers();
  }

  @ApiOperation({
    summary: 'Get user by id',
    description: 'Returns a user by id',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns a user by id',
    type: UserResponseDTO,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Access token required',
  })
  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<UserResponseDTO> {
    return this.userService.getUserById(id);
  }

  @ApiOperation({
    summary: 'Update user level',
    description: 'Updates the level of a user',
  })
  @ApiResponse({
    status: 200,
    description: 'User level updated',
    type: UserResponseDTO,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Access token required',
  })
  @Put(':id/level')
  async updateUserLevel(
    @Param('id') id: string,
    @Body() level: number,
  ): Promise<UserResponseDTO> {
    return this.userService.updateUserLevel(id, level);
  }

  @ApiOperation({
    summary: 'Update user xp',
    description: 'Updates the xp of a user',
  })
  @ApiResponse({
    status: 200,
    description: 'User xp updated',
    type: UserResponseDTO,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Access token required',
  })
  @Put(':id/xp')
  async updateUserXp(
    @Param('id') id: string,
    @Body() xp: number,
  ): Promise<UserResponseDTO> {
    return this.userService.updateUserXp(id, xp);
  }

  @ApiOperation({
    summary: 'Update user coins',
    description: 'Updates the coins of a user',
  })
  @ApiResponse({
    status: 200,
    description: 'User coins updated',
    type: UserResponseDTO,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Access token required',
  })
  @Put(':id/coins')
  async updateUserCoins(
    @Param('id') id: string,
    @Body() coins: number,
  ): Promise<UserResponseDTO> {
    return this.userService.updateUserCoins(id, coins);
  }

  @ApiOperation({
    summary: 'Update user streak',
    description: 'Updates the streak of a user',
  })
  @ApiResponse({
    status: 200,
    description: 'User streak updated',
    type: UserResponseDTO,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Access token required',
  })
  @Put(':id/streak')
  async updateUserStreak(
    @Param('id') id: string,
    @Body() streak: number,
  ): Promise<UserResponseDTO> {
    return this.userService.updateUserStreak(id, streak);
  }

  @ApiOperation({
    summary: 'Update user is premium',
    description: 'Updates the is premium of a user',
  })
  @ApiResponse({
    status: 200,
    description: 'User is premium updated',
    type: UserResponseDTO,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Access token required',
  })
  @Put(':id/is-premium')
  async updateUserIsPremium(
    @Param('id') id: string,
    @Body() isPremium: boolean,
  ): Promise<UserResponseDTO> {
    return this.userService.updateUserIsPremium(id, isPremium);
  }

  @ApiOperation({
    summary: 'Upload user profile image',
    description: 'Uploads a profile image for a user',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'Profile image file (JPEG, PNG, GIF, WebP, max 5MB)',
        },
      },
      required: ['image'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Profile image uploaded successfully',
    type: UserResponseDTO,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid file format or size',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Access token required',
  })
  @Post(':id/profile-image')
  @UseInterceptors(createFileUploadInterceptor())
  async uploadProfileImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UserResponseDTO> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    return await this.userService.uploadProfileImage(id, file);
  }
}
