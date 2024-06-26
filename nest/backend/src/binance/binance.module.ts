import { Module } from '@nestjs/common';
import { BinanceController } from './binance.controller';
import { BinanceService } from './binance.service';
import { FetchDataModule } from './fetch-data/fetch-data.module';
import { FetchDataService } from './fetch-data/fetch-data.service';
import { HttpModule } from '@nestjs/axios';
import { SaveDataModule } from 'src/save-data/save-data.module';
import { SaveDataService } from 'src/save-data/save-data.service';
import { DatabaseModule } from 'src/database/database.module';
import { DatabaseService } from 'src/database/database.service';


@Module({
  controllers: [BinanceController],
  providers: [BinanceService,FetchDataService, SaveDataService, DatabaseService],
  imports: [FetchDataModule, HttpModule, SaveDataModule]
})
export class BinanceModule {}
