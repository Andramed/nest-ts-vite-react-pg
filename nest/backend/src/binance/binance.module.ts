import { Module } from '@nestjs/common';
import { BinanceController } from './binance.controller';
import { BinanceService } from './binance.service';
import { FetchDataModule } from './fetch-data/fetch-data.module';
import { FetchDataService } from './fetch-data/fetch-data.service';
import { HttpModule } from '@nestjs/axios';


@Module({
  controllers: [BinanceController],
  providers: [BinanceService,FetchDataService, ],
  imports: [FetchDataModule, HttpModule]
})
export class BinanceModule {}
