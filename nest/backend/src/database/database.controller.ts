import { Controller, Get } from '@nestjs/common';
import { log } from 'console';
import { Observable, from } from 'rxjs';
import { DatabaseService } from './database.service';
import { Order } from 'src/save-data/order.entity';
@Controller('database')
export class DatabaseController {
    constructor(
        private databaseService: DatabaseService
    ){}
    @Get('tables')
    getTables(): Observable<string[]> {
        console.log('get Tables controller');
        return from(this.databaseService.getTables());
    }

    @Get("orders")
    findAll(): Promise<Order[]> {
        return this.databaseService.findAll();
    }
}
