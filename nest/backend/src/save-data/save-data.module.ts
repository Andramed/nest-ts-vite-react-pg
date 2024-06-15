import { Module } from '@nestjs/common';
import { SaveDataService } from './save-data.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Order])],  
  providers: [SaveDataService],
  exports:[SaveDataService, TypeOrmModule]
})
export class SaveDataModule {}
