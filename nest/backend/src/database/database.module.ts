import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from 'src/user/user.entity';
import { BinanceModule } from 'src/binance/binance.module';
import { SaveDataModule } from 'src/save-data/save-data.module';
import { DatabaseService } from './database.service';
import { Order } from 'src/save-data/order.entity';
import { Repository } from 'typeorm';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [User,Order],
        synchronize: true,
      }),
    }),
    BinanceModule,
    SaveDataModule
  ],
  providers:[DatabaseService, Repository],
  exports: [DatabaseService]
})
export class DatabaseModule {}
