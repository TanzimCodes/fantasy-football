// src/draft/draft.controller.ts
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DraftService } from './draft.service';
import { DraftAdviceDto } from './dto/draft-advice.dto';
import { DraftAdviceResponseDto } from './dto/draft-advice-response.dto';

@ApiTags('draft')
@Controller('draft-advice')
export class DraftController {
  constructor(private readonly draftService: DraftService) {}

  @Post()
  @ApiOperation({ summary: 'Get AI-powered draft advice' })
  @ApiResponse({ status: 200, type: DraftAdviceResponseDto })
  @HttpCode(HttpStatus.OK)
  async getAdvice(@Body() dto: DraftAdviceDto): Promise<DraftAdviceResponseDto> {
    return this.draftService.getAdvice(dto);
  }
}