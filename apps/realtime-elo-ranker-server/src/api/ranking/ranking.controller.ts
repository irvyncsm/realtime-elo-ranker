import { Controller, Get, Logger, Res, Sse } from '@nestjs/common';
import { RankingService } from './ranking.service';
import { Player } from '../../entities/player.entity';
import { Response } from 'express';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { fromEvent, map, Observable } from 'rxjs';

@Controller('api/ranking')
export class RankingController {
  constructor(
    private readonly rankingService: RankingService,
    private eventEmitter: EventEmitter2,
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

  @Sse('events')
  subscribeToEvents(): Observable<MessageEvent> {
    return fromEvent(this.eventEmitter, 'ranking.event').pipe(
      map((payload) => {
        Logger.log('Event sent');
        return {
          data: JSON.stringify(payload),
        } as MessageEvent;
      }),
    );
  }
}