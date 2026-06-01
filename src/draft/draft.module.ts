// src/draft/draft.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DraftController } from './draft.controller';
import { DraftService } from './draft.service';
import { PlayersModule } from 'src/players/players.module';

@Module({
  imports: [ConfigModule, PlayersModule],
  controllers: [DraftController],
  providers: [DraftService],
})
export class DraftModule {}