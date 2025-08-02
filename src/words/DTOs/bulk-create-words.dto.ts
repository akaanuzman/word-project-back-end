import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateWordDto } from './create-word.dto';

export class BulkCreateWordsDto {
  @ApiProperty({
    description: 'Array of words to be created',
    type: [CreateWordDto],
    example: [
      {
        word: 'hello',
        meaning: 'used as a greeting or to begin a phone conversation',
        level: 1,
        language_id: 'uuid-of-language',
        part_of_speech: 'noun',
      },
      {
        word: 'world',
        meaning:
          'the earth, together with all of its countries, peoples, and natural features',
        level: 1,
        language_id: 'uuid-of-language',
        part_of_speech: 'noun',
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateWordDto)
  words: CreateWordDto[];
}
