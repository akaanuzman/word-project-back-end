import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Param,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { WordsService } from './words.service';
import { CreateWordDto } from './DTOs/create-word.dto';
import { BulkCreateWordsDto } from './DTOs/bulk-create-words.dto';
import { GetWordsDto } from './DTOs/get-words.dto';
import {
  WordResponseDto,
  PaginatedWordsResponseDto,
} from './DTOs/word.response';

@ApiTags('Words')
@Controller('words')
export class WordsController {
  constructor(private readonly wordsService: WordsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a single word',
    description: 'Creates a new word in the database',
  })
  @ApiResponse({
    status: 201,
    description: 'Word created successfully',
    type: WordResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Word already exists or invalid data',
  })
  @ApiResponse({
    status: 404,
    description: 'Language not found',
  })
  async createWord(
    @Body() createWordDto: CreateWordDto,
  ): Promise<WordResponseDto> {
    return this.wordsService.createWord(createWordDto);
  }

  @Post('bulk')
  @ApiOperation({
    summary: 'Create multiple words',
    description: 'Creates multiple words from an array of word data',
  })
  @ApiResponse({
    status: 201,
    description: 'Words created successfully',
    schema: {
      type: 'object',
      properties: {
        created: { type: 'number', example: 5 },
        skipped: { type: 'number', example: 2 },
        errors: { type: 'array', items: { type: 'string' }, example: [] },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid language IDs or data',
  })
  async bulkCreateWords(
    @Body() bulkCreateWordsDto: BulkCreateWordsDto,
  ): Promise<{
    created: number;
    skipped: number;
    errors: string[];
  }> {
    return this.wordsService.bulkCreateWords(bulkCreateWordsDto);
  }

  @Post('bulk-json')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Create words from JSON file',
    description:
      'Upload a JSON file containing an array of words to create them in bulk',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'JSON file containing array of words',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Words created successfully from JSON file',
    schema: {
      type: 'object',
      properties: {
        created: { type: 'number', example: 10 },
        skipped: { type: 'number', example: 3 },
        errors: { type: 'array', items: { type: 'string' }, example: [] },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid file format or data',
  })
  async bulkCreateWordsFromJson(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{
    created: number;
    skipped: number;
    errors: string[];
  }> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (file.mimetype !== 'application/json') {
      throw new BadRequestException('Only JSON files are allowed');
    }

    try {
      const fileContent = file.buffer.toString('utf-8');
      const wordsData = JSON.parse(fileContent) as CreateWordDto[];

      if (!Array.isArray(wordsData)) {
        throw new BadRequestException(
          'JSON file must contain an array of words',
        );
      }

      const bulkCreateWordsDto: BulkCreateWordsDto = { words: wordsData };
      return this.wordsService.bulkCreateWords(bulkCreateWordsDto);
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new BadRequestException('Invalid JSON format');
      }
      throw error;
    }
  }

  @Get('by-language')
  @ApiOperation({
    summary: 'Get words by language with pagination',
    description:
      'Retrieves words for a specific language with pagination support',
  })
  @ApiResponse({
    status: 200,
    description: 'Words retrieved successfully',
    type: PaginatedWordsResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Language not found',
  })
  async getWordsByLanguage(
    @Query() getWordsDto: GetWordsDto,
  ): Promise<PaginatedWordsResponseDto> {
    return this.wordsService.getWordsByLanguage(getWordsDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get word by ID',
    description: 'Retrieves a specific word by its ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Word retrieved successfully',
    type: WordResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Word not found',
  })
  async getWordById(@Param('id') id: string): Promise<WordResponseDto> {
    return this.wordsService.getWordById(id);
  }
}
