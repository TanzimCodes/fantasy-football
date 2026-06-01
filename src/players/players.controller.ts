// src/players/players.controller.ts
import { Controller, Get, Post, Param, Body, HttpCode, HttpStatus, Patch, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { PlayersService } from './players.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { Player } from './entities/player.entity';
import { AssignTeamDto } from './dto/assign-team.dto';

@ApiTags('players')
@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) { }

  @Get()
  @ApiOperation({ summary: 'Get all players', description: 'Returns a list of all fantasy football players' })
  @ApiResponse({ status: 200, description: 'List of players retrieved successfully', type: [Player] })
  findAll(): Player[] {
    return this.playersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get player by ID' })
  @ApiParam({ name: 'id', description: 'Player ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Player found', type: Player })
  @ApiResponse({ status: 404, description: 'Player not found' })
  findOne(@Param('id') id: string): Player {
    return this.playersService.findOne(+id);
  }

    @Post()
    @ApiOperation({ summary: 'Create a new player' })
    @ApiResponse({ status: 201, description: 'Player created successfully', type: Player })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createPlayerDto: CreatePlayerDto): Player {
      return this.playersService.create(createPlayerDto);
    }

  @Patch(':id/team')
  @ApiOperation({ summary: 'Assign player to a team (draft them)' })
  @ApiParam({ name: 'id', description: 'Player ID' })
  @ApiBody({ schema: { properties: { teamId: { type: 'number' } } } })
  assignToTeam(
  @Param('id', ParseIntPipe) id: number,
  @Body() assignTeamDto: AssignTeamDto  // 👈 Now transformation works!
  ) {
    return this.playersService.assignToTeam(id, assignTeamDto.teamId);
  }

}