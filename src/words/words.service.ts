import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWordDto } from './DTOs/create-word.dto';
import { BulkCreateWordsDto } from './DTOs/bulk-create-words.dto';
import { GetWordsDto } from './DTOs/get-words.dto';
import {
  WordResponseDto,
  PaginatedWordsResponseDto,
} from './DTOs/word.response';

@Injectable()
export class WordsService {
  constructor(private readonly prisma: PrismaService) {}

  async createWord(createWordDto: CreateWordDto): Promise<WordResponseDto> {
    // Check if language exists
    const language = await this.prisma.languages.findUnique({
      where: { id: createWordDto.language_id },
    });

    if (!language) {
      throw new NotFoundException('Language not found');
    }

    // Check if word already exists for this language
    const existingWord = await this.prisma.words.findFirst({
      where: {
        word: createWordDto.word,
        language_id: createWordDto.language_id,
      },
    });

    if (existingWord) {
      throw new BadRequestException('Word already exists for this language');
    }

    const word = await this.prisma.words.create({
      data: {
        word: createWordDto.word,
        meaning: createWordDto.meaning,
        level: createWordDto.level,
        language_id: createWordDto.language_id,
        part_of_speech: createWordDto.part_of_speech,
      },
    });

    return {
      id: word.id,
      word: word.word,
      meaning: word.meaning,
      level: word.level,
      language_id: word.language_id,
      part_of_speech: word.part_of_speech,
    };
  }

  async bulkCreateWords(bulkCreateWordsDto: BulkCreateWordsDto): Promise<{
    created: number;
    skipped: number;
    errors: string[];
  }> {
    const { words } = bulkCreateWordsDto;
    let created = 0;
    let skipped = 0;
    const errors: string[] = [];

    // Check if all languages exist
    const languageIds = [...new Set(words.map((word) => word.language_id))];
    const languages = await this.prisma.languages.findMany({
      where: { id: { in: languageIds } },
    });

    const existingLanguageIds = languages.map((lang) => lang.id);
    const invalidLanguageIds = languageIds.filter(
      (id) => !existingLanguageIds.includes(id),
    );

    if (invalidLanguageIds.length > 0) {
      throw new BadRequestException(
        `Invalid language IDs: ${invalidLanguageIds.join(', ')}`,
      );
    }

    // Process words in batches
    for (const wordDto of words) {
      try {
        // Check if word already exists
        const existingWord = await this.prisma.words.findFirst({
          where: {
            word: wordDto.word,
            language_id: wordDto.language_id,
          },
        });

        if (existingWord) {
          skipped++;
          continue;
        }

        await this.prisma.words.create({
          data: {
            word: wordDto.word,
            meaning: wordDto.meaning,
            level: wordDto.level,
            language_id: wordDto.language_id,
            part_of_speech: wordDto.part_of_speech,
          },
        });

        created++;
      } catch (error) {
        errors.push(`Error creating word "${wordDto.word}": ${error}`);
      }
    }

    return { created, skipped, errors };
  }

  async getWordsByLanguage(
    getWordsDto: GetWordsDto,
  ): Promise<PaginatedWordsResponseDto> {
    const {
      language_id,
      page = 1,
      limit = 10,
      level,
      part_of_speech,
    } = getWordsDto;

    // Check if language exists
    const language = await this.prisma.languages.findUnique({
      where: { id: language_id },
    });

    if (!language) {
      throw new NotFoundException('Language not found');
    }

    // Build where clause
    const whereClause: {
      language_id: string;
      level?: number;
      part_of_speech?: string;
    } = {
      language_id,
    };

    if (level) {
      whereClause.level = level;
    }

    if (part_of_speech) {
      whereClause.part_of_speech = part_of_speech;
    }

    // Get total count
    const total = await this.prisma.words.count({
      where: whereClause,
    });

    // Calculate pagination
    const skip = (page - 1) * limit;
    const totalPages = Math.ceil(total / limit);

    // Get words with pagination
    const words = await this.prisma.words.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: {
        word: 'asc',
      },
    });

    return {
      words: words.map((word) => ({
        id: word.id,
        word: word.word,
        meaning: word.meaning,
        level: word.level,
        language_id: word.language_id,
        part_of_speech: word.part_of_speech,
      })),
      total,
      page,
      limit,
      totalPages,
    };
  }

  async getWordById(id: string): Promise<WordResponseDto> {
    const word = await this.prisma.words.findUnique({
      where: { id },
    });

    if (!word) {
      throw new NotFoundException('Word not found');
    }

    return {
      id: word.id,
      word: word.word,
      meaning: word.meaning,
      level: word.level,
      language_id: word.language_id,
      part_of_speech: word.part_of_speech,
    };
  }
}
