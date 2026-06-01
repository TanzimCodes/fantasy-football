// src/draft/dto/draft-advice.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsArray, IsString, Min, Max, ArrayMinSize, IsNotEmpty } from 'class-validator';

export class DraftAdviceDto {
  @ApiProperty({ description: 'Current draft pick number', example: 12, minimum: 1, maximum: 16 })
  @IsNumber()
  @Min(1)
  @Max(16)
  pick: number;


  @ApiProperty({ description: 'League type', enum: ['PPR', 'Standard', 'Half-PPR'], example: 'PPR' })
  @IsString()
  @IsNotEmpty()
  leagueType: string;
}