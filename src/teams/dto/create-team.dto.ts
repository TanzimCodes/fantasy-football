// src/teams/dto/create-team.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateTeamDto {
  @ApiProperty({ description: 'Team name', example: 'The Destroyers' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Owner email', example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  ownerEmail: string;
}