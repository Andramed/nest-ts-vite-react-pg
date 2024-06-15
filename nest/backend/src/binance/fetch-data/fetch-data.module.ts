import { Module } from '@nestjs/common';
import { FetchDataService } from './fetch-data.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { SaveDataModule } from 'src/save-data/save-data.module';

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    SaveDataModule
  ],
  providers: [
    FetchDataService,
    ConfigService
  ],
  exports: [FetchDataService]
})
export class FetchDataModule {}
