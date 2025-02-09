import { Module } from '@nestjs/common';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from '../../entities/match.entity';
import { Player } from '../../entities/player.entity';
import { PlayerService } from '../player/player.service';

@Module({
  imports: [TypeOrmModule.forFeature([Match, Player])],
  controllers: [MatchController],
  providers: [MatchService, PlayerService],
  exports: [MatchService, PlayerService],
})
export class MatchModule {}