import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from 'src/entities/player.entity';
import { CreatePlayerDto } from './dto/create-player.dto';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player)
    private playersRepository: Repository<Player>,
  ) {}

  create(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const player = this.playersRepository.create(createPlayerDto);
    return this.playersRepository.save(player);
  }

  findAll(): Promise<Player[]> {
    return this.playersRepository.find();
  }

  async findOne(id: string): Promise<Player> {
    const player = await this.playersRepository.findOneBy({ id });
    if (!player) {
      throw new Error(`Player with id ${id} not found`);
    }
    return player;
  }
}