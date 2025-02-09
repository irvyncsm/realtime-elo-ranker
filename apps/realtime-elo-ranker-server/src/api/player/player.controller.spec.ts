import { Test, TestingModule } from '@nestjs/testing';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from '../../entities/player.entity';
import { CreatePlayerDto } from './dto/create-player.dto';
import { Response } from 'express';

describe('PlayerController', () => {
  let playerController: PlayerController;
  let playerService: PlayerService;

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
      controllers: [PlayerController],
      providers: [PlayerService],
    }).compile();

    playerController = module.get<PlayerController>(PlayerController);
    playerService = module.get<PlayerService>(PlayerService);
  });

  it('should be defined', () => {
    expect(playerController).toBeDefined();
    expect(playerService).toBeDefined();
  });

  // Response test
  const res = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
  } as unknown as Response;

  it('should return 409 if player already exists', async () => {
    const createPlayerDto: CreatePlayerDto = { id: 'irvyn', rank: 1000 };

    jest.spyOn(playerService, 'playerExists').mockResolvedValue(true);

    await playerController.create(createPlayerDto, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.send).toHaveBeenCalledWith({
      code: 0,
      message: 'Joueur déjà existant',
    });
  });

  it('should return 201 if player is created', async () => {
    const createPlayerDto: CreatePlayerDto = { id: 'irvyn', rank: 1000 };

    jest.spyOn(playerService, 'playerExists').mockResolvedValue(false);
    jest.spyOn(playerService, 'create').mockResolvedValue(createPlayerDto);

    await playerController.create(createPlayerDto, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith(createPlayerDto);
  });
});