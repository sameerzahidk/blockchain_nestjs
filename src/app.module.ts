import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule'; // For scheduling tasks
import { AppController } from './app.controller';
import { WalletController } from './wallet.controller'; // Import the WalletController
import { AppService } from './app.service';
import { MoralisModule } from './moralis/moralis.module'; // Import Moralis module
import { CryptoPrice } from './moralis/entities/crypto-price.entity'; // Import entity
import { PriceSchedulerService } from './price-scheduler.service'; // Import scheduler
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailModule } from './email.module';
import { InputPageModule } from './input-page/input-page.module';

@Module({
  imports: [
    InputPageModule,
    EmailModule,
    MoralisModule, // Moralis module for fetching data
    TypeOrmModule.forRoot({
      type: 'mysql', // Or whatever database you're using
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'blockchain',
      entities: [CryptoPrice], // Entity for the CryptoPrice table
      synchronize: true, // This will auto-create tables, for development only
    }),
    TypeOrmModule.forFeature([CryptoPrice]), // Register entity for use
    ScheduleModule.forRoot(), // Schedule module for tasks
  ],
  controllers: [AppController, WalletController], // Register WalletController here
  providers: [AppService, PriceSchedulerService], // Register scheduler service
})
export class AppModule {}
