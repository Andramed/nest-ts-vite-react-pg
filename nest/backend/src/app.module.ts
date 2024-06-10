import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { BinanceController } from './binance/binance.controller';
import { BinanceModule } from './binance/binance.module';
import { FetchDataModule } from './binance/fetch-data/fetch-data.module';


@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal:true
    }),
    UserModule,
    BinanceModule,
    FetchDataModule
  ],
  controllers: [AppController, BinanceController],
  providers: [AppService],
})
export class AppModule {}

