import { Controller, Post, Body, Res, Logger } from '@nestjs/common';
import { PlayerService } from './player.service';
import { Player } from 'src/entities/player.entity';
import { Response } from 'express';
import { CreatePlayerDto } from './dto/create-player.dto';

@Controller('api/player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Post()
  async create(
    @Body() createPlayerDto: CreatePlayerDto,
    @Res() res: Response,
  ): Promise<Response<Player | Error>> {

    const alreadyExist = await this.playerService.playerExists(createPlayerDto.id);

    if (alreadyExist) {
      Logger.error(`Joueur ${createPlayerDto.id} déjà existant`);
      return res.status(409).send({
        code: 0,
        message: 'Joueur déjà existant',
      }) as Response<Error>;
    }

    await this.playerService.create(createPlayerDto);

    Logger.log(`Joueur ${createPlayerDto.id} créé avec succès`);
    return res.status(201).send(createPlayerDto) as Response<Player>;
  }
}