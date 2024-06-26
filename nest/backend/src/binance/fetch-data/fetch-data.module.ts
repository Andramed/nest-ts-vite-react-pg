import { Module } from '@nestjs/common';
import { FetchDataService } from './fetch-data.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { SaveDataModule } from 'src/save-data/save-data.module';
import { DatabaseModule } from 'src/database/database.module';
import { DatabaseService } from 'src/database/database.service';

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    SaveDataModule,
  
  ],
  providers: [
    FetchDataService,
    ConfigService,
    DatabaseService
  ],
  exports: [FetchDataService]
})
export class FetchDataModule {}
