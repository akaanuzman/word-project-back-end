import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateWordDto {
  @ApiProperty({
    description: 'The word to be added',
    example: 'hello',
  })
  @IsString()
  @IsNotEmpty()
  word: string;

  @ApiProperty({
    description: 'The meaning of the word',
    example: 'used as a greeting or to begin a phone conversation',
  })
  @IsString()
  @IsNotEmpty()
  meaning: string;

  @ApiProperty({
    description: 'The CEFR level of the word (1-6)',
    example: 1,
  })
  @IsNumber()
  level: number;

  @ApiProperty({
    description: 'The language ID',
    example: 'uuid-of-language',
  })
  @IsString()
  @IsNotEmpty()
  language_id: string;

  @ApiProperty({
    description: 'The part of speech',
    example: 'noun',
  })
  @IsString()
  @IsNotEmpty()
  part_of_speech: string;
}
