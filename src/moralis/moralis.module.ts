import { Module } from '@nestjs/common';
import { MoralisService } from './moralis.service';
import { TypeOrmModule } from '@nestjs/typeorm';  // Import TypeOrmModule
import { CryptoPrice } from './entities/crypto-price.entity';  // Import the entity

@Module({
  imports: [
    TypeOrmModule.forFeature([CryptoPrice]),  // Register the entity here
  ],
  providers: [MoralisService],
  exports: [MoralisService],
})
export class MoralisModule {}
