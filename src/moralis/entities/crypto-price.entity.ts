import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class CryptoPrice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 10 })
  symbol: string;

  @Column('decimal', { precision: 18, scale: 8 })
  price: number;

  @CreateDateColumn()
  timestamp: Date;
}
