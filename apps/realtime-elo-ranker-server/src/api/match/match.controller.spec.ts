import { Test, TestingModule } from '@nestjs/testing';
import { MatchController } from './match.controller';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Match } from '../../entities/match.entity';
import { Player } from '../../entities/player.entity';
import { MatchService } from './match.service';
import { PlayerService } from '../player/player.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { Response } from 'express';
import { Repository } from 'typeorm';

describe('MatchController', () => {
  let matchController: MatchController;
  let matchService: MatchService;
  let playerRepository: Repository<Player>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Player, Match],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Player, Match]),
      ],
      controllers: [MatchController],
      providers: [MatchService, PlayerService],
    }).compile();

    matchController = module.get<MatchController>(MatchController);
    matchService = module.get<MatchService>(MatchService);
    playerRepository = module.get<Repository<Player>>(getRepositoryToken(Player));
  });

  it('should be defined', () => {
    expect(matchController).toBeDefined();
    expect(matchService).toBeDefined();
  });

  // Response test
  const res = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
  } as unknown as Response;

  it('should return 201 if match is created', async () => {
    const createMatchDto: CreateMatchDto = {
      winner: 'irvyn',
      loser: 'jean',
      draw: false,
    };

    await playerRepository.save([
      { id: 'irvyn', rank: 1000 },
      { id: 'jean', rank: 1000 },
    ]);

    await matchController.create(createMatchDto, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith(createMatchDto);
  });
});