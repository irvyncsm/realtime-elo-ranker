import { Test, TestingModule } from '@nestjs/testing';
import { PlayerService } from './player.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Player } from 'src/entities/player.entity';
import { Repository } from 'typeorm';

describe('PlayerService', () => {
  let service: PlayerService;
  let repository: Repository<Player>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerService,
        {
          provide: getRepositoryToken(Player),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<PlayerService>(PlayerService);
    repository = module.get<Repository<Player>>(getRepositoryToken(Player));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a player', async () => {
    const createPlayerDto = { id: 'player1' };
    jest.spyOn(repository, 'save').mockResolvedValue(createPlayerDto as Player);
    expect(await service.create(createPlayerDto)).toEqual(createPlayerDto);
  });

  it('should find all players', async () => {
    const players = [{ id: 'player1' }];
    jest.spyOn(repository, 'find').mockResolvedValue(players as Player[]);
    expect(await service.findAll()).toEqual(players);
  });

  it('should find one player by id', async () => {
    const player = { id: 'player1' };
    jest.spyOn(repository, 'findOneBy').mockResolvedValue(player as Player);
    expect(await service.findOne('player1')).toEqual(player);
  });
});