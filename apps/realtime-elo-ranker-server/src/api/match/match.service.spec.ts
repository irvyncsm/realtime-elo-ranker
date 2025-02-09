import { Test, TestingModule } from '@nestjs/testing';
import { MatchService } from './match.service';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Player } from '../../entities/player.entity';
import { Match } from '../../entities/match.entity';
import { Repository } from 'typeorm';

describe('MatchService', () => {
  let matchService: MatchService;
  let matchRepository: Repository<Match>;
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
      providers: [MatchService],
    }).compile();

    matchService = module.get<MatchService>(MatchService);
    matchRepository = module.get<Repository<Match>>(getRepositoryToken(Match));
    playerRepository = module.get<Repository<Player>>(getRepositoryToken(Player));
  });

  it('should be defined', () => {
    expect(matchService).toBeDefined();
  });

  // Match test
  const match: Match = {
    winner: 'irvyn',
    loser: 'jean',
    draw: false,
  };

  it('should return all matches', async () => {
    await matchRepository.save(match);
    const matches = await matchService.findAll();
    expect(matches).toEqual([match]);
  });

  it('should create a match', async () => {
    const createdMatch = await matchService.create(match);
    expect(createdMatch).toEqual(match);
  });

  it('should update rank (win)', async () => {
    const winner = {
      id: 'irvyn',
      rank: 1000,
    };
    const loser = {
      id: 'jean',
      rank: 1000,
    };
    const draw = false;

    await playerRepository.save(winner);
    await playerRepository.save(loser);

    const result = matchService.computeRank(winner, loser, draw);
    if (result) {
      expect(result.winnerPlayer.rank).toEqual(1016);
      expect(result.loserPlayer.rank).toEqual(984);
    }
  });

  it('should update rank (draw)', async () => {
    const winner = {
      id: 'irvyn',
      rank: 1000,
    };
    const loser = {
      id: 'jean',
      rank: 1000,
    };
    const draw = true;

    await playerRepository.save(winner);
    await playerRepository.save(loser);

    const result = matchService.computeRank(winner, loser, draw);
    if (result) {
      expect(result.winnerPlayer.rank).toEqual(1000);
      expect(result.loserPlayer.rank).toEqual(1000);
    }
  });
});