// create assign-team.dto.ts
import { Type } from 'class-transformer';
import { IsNumber, IsNotEmpty } from 'class-validator';

export class AssignTeamDto {
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  teamId: number;
}