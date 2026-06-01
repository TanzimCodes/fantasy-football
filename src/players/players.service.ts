// src/players/players.service.ts (UPDATED)
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { Player } from './entities/player.entity';
import { TeamsService } from '../teams/teams.service'; // 👈 Import TeamsService
import { PlayerPosition } from './types/player-position';

@Injectable()
export class PlayersService {
  private players: Player[] = [];
  private idCounter = 1;

  constructor(private readonly teamsService: TeamsService) { } // 👈 Inject TeamsService

  findAll(): Player[] {
    return this.players;
  }

  findOne(id: number): Player {
    const player = this.players.find(p => p.id === id);
    if (!player) {
      throw new NotFoundException(`Player with ID ${id} not found`);
    }
    return player;
  }

  // 👈 NEW: Get only players without a team (free agents)
  findAvailablePlayers(): Player[] {
    return this.players.filter(player => !player.teamId);
  }

  // 👈 NEW: Assign player to a team (when drafted)
  assignToTeam(playerId: number, teamId: number): Player {
    const player = this.players.find(p => p.id === playerId);
    if (!player) {
      throw new NotFoundException(`Player ${playerId} not found`);
    }
    player.teamId = teamId;
    console.log(player)
    return player;
  }



  create(createPlayerDto: CreatePlayerDto): Player {
    if (createPlayerDto.teamId !== null) {
      const teamExists = this.teamsService.findOne(createPlayerDto.teamId);

      if (!teamExists) {
        throw new BadRequestException(
          `Team with ID ${createPlayerDto.teamId} does not exist.`,
        );
      }
    }

    const newPlayer: Player = {
      id: this.idCounter++,
      ...createPlayerDto,
      teamId: createPlayerDto.teamId || null, // Allow optional
    };

    this.players.push(newPlayer);
    return newPlayer;
  }

}