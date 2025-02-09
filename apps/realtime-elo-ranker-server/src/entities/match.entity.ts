import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Match {
  @PrimaryColumn()
  winner: string;

  @PrimaryColumn()
  loser: string;

  @Column()
  draw: boolean;
}
