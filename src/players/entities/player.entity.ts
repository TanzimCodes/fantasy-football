// src/players/entities/player.entity.ts
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { PlayerPosition } from "../types/player-position";


export class Player {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  position: PlayerPosition;

  @ApiPropertyOptional()
  teamId: number | null;

  @ApiProperty()
  byeWeek: number;

  @ApiProperty()
  avgDraftPosition: number;

  @ApiProperty()
  projectedPoints: number;
}