// src/players/players.module.ts
import { Module } from '@nestjs/common';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';
import { TeamsModule } from 'src/teams/teams.module';

@Module({
  imports: [TeamsModule], // 👈 Add this so PlayersService can use TeamsService
  controllers: [PlayersController],
  providers: [PlayersService],
  exports: [PlayersService], // Export if other modules need it
})
export class PlayersModule {}