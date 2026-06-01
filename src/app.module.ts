// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PlayersModule } from './players/players.module';
import { TeamsModule } from './teams/teams.module';
import { DraftModule } from './draft/draft.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    PlayersModule,
    TeamsModule,
    DraftModule,
  ],
})
export class AppModule {}