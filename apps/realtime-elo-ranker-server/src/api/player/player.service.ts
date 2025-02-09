import { Injectable } from '@nestjs/common';
import { Player } from 'src/entities/player.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player)
    private readonly players: Repository<Player>,
  ) {}

  findOne(id: string): Promise<Player | null> {
    return this.players.findOne({ where: { id } });
  }

  playerExists(id: string): Promise<boolean> {
    return this.findOne(id).then((player) => !!player);
  }

  findAll(): Promise<Player[]> {
    return this.players.find();
  }

  create(player: Player): Promise<Player> {
    return this.players.save(player);
  } 

  save(player: Player): Promise<Player> {
    return this.players.save(player);
  }
}