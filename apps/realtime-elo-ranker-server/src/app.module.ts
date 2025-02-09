import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MatchController } from './api/match/match.controller';
import { PlayerController } from './api/player/player.controller';
import { RankingController } from './api/ranking/ranking.controller';
import { RankingModule } from './api/ranking/ranking.module';
import { MatchModule } from './api/match/match.module';
import { PlayerModule } from './api/player/player.module';

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
  providers: [AppService],
})
export class AppModule {}
