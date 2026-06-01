// src/players/dto/create-player.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsIn, Min, Max, IsEnum, IsOptional } from 'class-validator';
import { PlayerPosition } from '../types/player-position';

export class CreatePlayerDto {
  @ApiProperty({ description: 'Player full name', example: 'Patrick Mahomes' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Position', enum: ['QB', 'RB', 'WR', 'TE', 'K', 'DEF'] })
  @IsString()
  @IsNotEmpty()
  @IsEnum(PlayerPosition)
  position: PlayerPosition;

  @ApiProperty({ description: 'Team ID that owns this player', example: 1 , required: false  })
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  teamId: number;  // 👈 Changed from 'team' string to teamId number

  @ApiProperty({ description: 'Bye week number', example: 10, minimum: 1, maximum: 18 })
  @IsNumber()
  @Min(1)
  @Max(18)
  byeWeek: number;

  @ApiProperty({ description: 'Average Draft Position (lower = better)', example: 4.5 })
  @IsNumber()
  avgDraftPosition: number;

  @ApiProperty({ description: 'Projected fantasy points for season', example: 320.5 })
  @IsNumber()
  projectedPoints: number;
}