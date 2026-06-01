// src/draft/draft.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';  // 👈 Changed from GoogleGenAI
import { PlayersService } from '../players/players.service';
import { DraftAdviceResponseDto } from './dto/draft-advice-response.dto';
import { DraftAdviceDto } from './dto/draft-advice.dto';
import { Player } from 'src/players/entities/player.entity';

@Injectable()
export class DraftService {
  private readonly groq: Groq;  // 👈 Changed from ai to groq
  private readonly logger = new Logger(DraftService.name);

  constructor(
    private configService: ConfigService,
    private playersService: PlayersService,
  ) {
    const apiKey = this.configService.get<string>('GROQ_API_KEY');  // 👈 Changed env var
    if (!apiKey) {
      this.logger.warn('GROQ_API_KEY not found. AI features disabled.');
    }
    this.groq = new Groq({ apiKey });  // 👈 Changed initialization
  }

  async getAdvice(dto: DraftAdviceDto): Promise<DraftAdviceResponseDto> {
    const availablePlayers = this.playersService.findAvailablePlayers();

    if (availablePlayers.length === 0) {
      this.logger.warn('No available players found');
      return this.getFallbackAdvice(dto);
    }

    const prompt = this.buildPrompt(dto, availablePlayers);

    try {
      // 👇 Groq API call (different from Gemini)
      const response = await this.groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',  // Groq's fast model (free tier)
        messages: [
          {
            role: 'system',
            content: 'You are a fantasy football draft expert. Always respond with valid JSON only, no other text.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 500,
        response_format: { type: 'json_object' },  // 👈 Groq supports JSON mode
      });

      const aiResponse = response.choices[0]?.message?.content;
      
      if (!aiResponse) {
        throw new Error('Groq returned empty response');
      }
      
      this.logger.debug(`Groq response: ${aiResponse}`);
      return this.parseAIResponse(aiResponse, availablePlayers);
      
    } catch (error) {
      this.logger.error('Groq AI failed:', error);
      return this.getFallbackAdvice(dto);
    }
  }

  private buildPrompt(dto: DraftAdviceDto, availablePlayers: Player[]): string {
    const playerList = availablePlayers.map(p =>
      `- ${p.name} (${p.position}): ${p.projectedPoints} projected points, ADP ${p.avgDraftPosition}`
    ).join('\n');

    return `You are a fantasy football draft expert.

Available players to draft:
${playerList}

Draft pick: #${dto.pick}
League type: ${dto.leagueType}

Based on the available players above, recommend the best player to draft.
Consider: position scarcity, value at pick #${dto.pick}, and ${dto.leagueType} scoring.

Respond with a JSON object:
{
  "recommendedPlayer": "exact player name from the list",
  "reasoning": "brief explanation (max 20 words)",
  "confidenceScore": 0-100
}`;
  }

  private parseAIResponse(aiResponse: string, availablePlayers: Player[]): DraftAdviceResponseDto {
    try {
      // Try to parse the JSON response
      const parsed = JSON.parse(aiResponse);
      
      // Validate that recommended player exists in availablePlayers
      const recommendedExists = availablePlayers.some(
        p => p.name.toLowerCase() === parsed.recommendedPlayer?.toLowerCase()
      );
      
      if (!recommendedExists && availablePlayers.length > 0) {
        this.logger.warn(`Recommended player "${parsed.recommendedPlayer}" not found in available players`);
        return {
          recommendedPlayer: availablePlayers[0].name,
          reasoning: parsed.reasoning || 'Fallback: Top available player',
          confidenceScore: parsed.confidenceScore || 70,
        };
      }
      
      return {
        recommendedPlayer: parsed.recommendedPlayer || availablePlayers[0]?.name,
        reasoning: parsed.reasoning || 'AI recommendation',
        confidenceScore: parsed.confidenceScore || 75,
      };
    } catch (e) {
      this.logger.warn('Failed to parse AI response as JSON:', aiResponse);
      return this.getFallbackAdvice({ availablePlayers: availablePlayers.map(p => p.name) } as any);
    }
  }

  private getFallbackAdvice(dto: any): DraftAdviceResponseDto {
    // Fallback when AI fails — recommend best player by projected points
    const availablePlayers = this.playersService.findAvailablePlayers();
    
    if (availablePlayers.length === 0) {
      return {
        recommendedPlayer: 'No players available',
        reasoning: 'All players have been drafted.',
        confidenceScore: 0,
      };
    }
    
    // Sort by projected points (highest first)
    const sorted = [...availablePlayers].sort((a, b) => b.projectedPoints - a.projectedPoints);
    const topPlayer = sorted[0];
    
    return {
      recommendedPlayer: topPlayer.name,
      reasoning: `Fallback recommendation: Best by projected points (${topPlayer.projectedPoints})`,
      confidenceScore: 65,
    };
  }
}