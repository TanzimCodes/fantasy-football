// src/draft/dto/draft-advice-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class DraftAdviceResponseDto {
  @ApiProperty({ example: 'Saquon Barkley' })
  recommendedPlayer: string;

  @ApiProperty({ example: 'RB is a top need for your team right now' })
  reasoning: string;

  @ApiProperty({ example: 88 })
  confidenceScore: number;
}