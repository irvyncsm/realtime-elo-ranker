import { Body, Controller, Logger, Post, Res } from '@nestjs/common';
import { Match } from '../../entities/match.entity';
import { MatchService } from './match.service';
import { Response } from 'express';
import { CreateMatchDto } from './dto/create-match.dto';
import { PlayerService } from '../player/player.service';

@Controller('api/match')
export class MatchController {
  constructor(
    private readonly matchService: MatchService,
    private readonly playerService: PlayerService,
  ) {}

  @Post()
  async create(
    @Body() createMatchDto: CreateMatchDto,
    @Res() res: Response,
  ): Promise<Response<Match | Error>> {
    const { winner, loser, draw } = createMatchDto;

    // Check if winner and loser are the same
    if (winner === loser) {
      Logger.error(
        'Le gagnant et le perdant ne peuvent pas être les mêmes',
      );
      return res.status(422).send({
        code: 0,
        message:
            'Le gagnant et le perdant ne peuvent pas être les mêmes',
      }) as Response<Error>;
    }

    // Check if winner and loser exist
    const winnerExist = await this.playerService.playerExists(winner);
    const loserExist = await this.playerService.playerExists(loser);

    if (!winnerExist || !loserExist) {
      Logger.error("Le gagnant ou le perdant n'existe pas");
      return res.status(422).send({
        code: 0,
        message: "Le gagnant ou le perdant n'existe pas",
      }) as Response<Error>;
    }

    void this.matchService.create(createMatchDto).then(() => {
      void this.matchService.updateRank(winner, loser, draw);
    });

    Logger.log('Match entre ' + winner + ' et ' + loser + ' créé avec succès');
    return res.status(201).send(createMatchDto) as Response<Match>;
  }
}