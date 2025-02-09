import { Controller, Get, Logger, Res } from '@nestjs/common';
import { RankingService } from './ranking.service';
import { Player } from '../../entities/player.entity';
import { Response } from 'express';

@Controller('api/ranking')
export class RankingController {
  constructor(
    private readonly rankingService: RankingService,
  ) {}

  @Get()
  async findAll(@Res() res: Response): Promise<Response<Player[] | { code: number; message: string }>> {
    const players = await this.rankingService.findAll();
    if (players.length === 0) {
      Logger.error('Aucun joueur trouvé dans la base de données');
      return res.status(404).send({
        code: 0,
        message: 'Aucun joueur trouvé dans la base de données',
      });
    }
    return res.status(200).send(players);
  }
}