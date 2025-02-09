import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MatchController } from './match/match.controller';
import { PlayerController } from './player/player.controller';
import { RankingController } from './ranking/ranking.controller';
import { RankingService } from './ranking/ranking.service';
import { RankingModule } from './ranking/ranking.module';
import { MatchModule } from './match/match.module';
import { PlayerModule } from './player/player.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    PlayerModule,
    RankingModule,
    MatchModule,
  ],
  controllers: [AppController, PlayerController, MatchController, RankingController],
  providers: [AppService, RankingService],
})
export class AppModule {}
