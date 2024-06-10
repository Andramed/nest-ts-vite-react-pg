import { Module } from '@nestjs/common';
import { FetchDataService } from './fetch-data.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule,
    HttpModule
  ],
  providers: [
    FetchDataService,
    ConfigService
  ],
  exports: [FetchDataService]
})
export class FetchDataModule {}
