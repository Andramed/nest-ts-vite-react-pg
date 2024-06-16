import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { BinanceController } from './binance/binance.controller';
import { BinanceModule } from './binance/binance.module';
import { FetchDataModule } from './binance/fetch-data/fetch-data.module';
import { SaveDataModule } from './save-data/save-data.module';
import { DatabaseController } from './database/database.controller';
import { DatabaseService } from './database/database.service';




@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal:true
    }),
    UserModule,
    BinanceModule,
    FetchDataModule,
    SaveDataModule,
    
  ],
  controllers: [AppController, BinanceController, DatabaseController],
  providers: [AppService],
})
export class AppModule {}

