// src/teams/teams.service.ts
import { Injectable } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { Team } from './entities/team.entity';

@Injectable()
export class TeamsService {
  private teams: Team[] = [];
  private idCounter = 1;

  findAll(): Team[] {
    return this.teams;
  }

  findOne(id: number): Team | undefined {
    return this.teams.find(team => team.id === id);
  }

  create(createTeamDto: CreateTeamDto): Team {
    const newTeam: Team = {
      id: this.idCounter++,
      ...createTeamDto,
      createdAt: new Date(),
    };
    this.teams.push(newTeam);
    return newTeam;
  }
}