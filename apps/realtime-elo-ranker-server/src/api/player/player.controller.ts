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

    await this.playerService.create(createPlayerDto);

    Logger.log(`Joueur ${createPlayerDto.id} créé avec succès`);
    return res.status(201).send(createPlayerDto) as Response<Player>;
  }
}