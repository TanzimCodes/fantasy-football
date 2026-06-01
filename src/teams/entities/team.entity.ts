// src/teams/entities/team.entity.ts
import { ApiProperty } from '@nestjs/swagger';

export class Team {
  @ApiProperty({ example: 1 })
  id: number;
  
  @ApiProperty({ example: "The Destroyers" })
  name: string;
  
  @ApiProperty({ example: "user@example.com" })
  ownerEmail: string;
  
  @ApiProperty({ example: "2024-05-31T19:00:00.000Z" })
  createdAt: Date;
}