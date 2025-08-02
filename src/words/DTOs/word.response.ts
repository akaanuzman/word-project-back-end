import { ApiProperty } from '@nestjs/swagger';

export class WordResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the word',
    example: 'uuid-of-word',
  })
  id: string;

  @ApiProperty({
    description: 'The word',
    example: 'hello',
  })
  word: string;

  @ApiProperty({
    description: 'The meaning of the word',
    example: 'used as a greeting or to begin a phone conversation',
  })
  meaning: string;

  @ApiProperty({
    description: 'The CEFR level of the word',
    example: 1,
  })
  level: number;

  @ApiProperty({
    description: 'The language ID',
    example: 'uuid-of-language',
  })
  language_id: string;

  @ApiProperty({
    description: 'The part of speech',
    example: 'noun',
  })
  part_of_speech: string;
}

export class PaginatedWordsResponseDto {
  @ApiProperty({
    description: 'Array of words',
    type: [WordResponseDto],
  })
  words: WordResponseDto[];

  @ApiProperty({
    description: 'Total number of words',
    example: 100,
  })
  total: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
  })
  limit: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 10,
  })
  totalPages: number;
}
