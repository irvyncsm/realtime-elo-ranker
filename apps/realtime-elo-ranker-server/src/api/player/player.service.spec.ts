import { Test, TestingModule } from '@nestjs/testing';
import { PlayerService } from './player.service';
import { Player } from '../../entities/player.entity';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('PlayerService', () => {
  let playerService: PlayerService;
  let playerRepository: Repository<Player>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Player],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Player]),
      ],
      providers: [PlayerService],
    }).compile();

    playerService = module.get<PlayerService>(PlayerService);
    playerRepository = module.get<Repository<Player>>(getRepositoryToken(Player));
  });

  it('should be defined', () => {
    expect(playerService).toBeDefined();
  });

  // Player test
  const player: Player = {
    id: 'irvyn',
    rank: 1000,
  };

  it('should return player with id=irvyn', async () => {
    await playerRepository.save(player);
    const foundPlayer = await playerService.findOne(player.id);
    expect(foundPlayer).toEqual(player);
  });

  it('should return playerExists=true', async () => {
    await playerRepository.save(player);
    const exists = await playerService.playerExists(player.id);
    expect(exists).toBe(true);
  });

  it('should return playerExists=false', async () => {
    const exists = await playerService.playerExists('abc');
    expect(exists).toBe(false);
  });
});