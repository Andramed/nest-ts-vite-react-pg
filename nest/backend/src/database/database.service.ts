import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { log } from 'console';
import { Observable, from } from 'rxjs';
import { Order } from 'src/save-data/order.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class DatabaseService {
    constructor(
        private readonly dataSource: DataSource,
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
    ){}
    

        getTables(): Observable<string[]> {
            console.log('get tables service');
            const queryRunner = this.dataSource.createQueryRunner();
            const sql = `
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
            `;
            return from(queryRunner.query(sql).then((tables: { table_name: string }[]) => {
            console.log('Tables fetched from queryRunner');
            queryRunner.release();
            const tableNames = tables.map(table => {
                console.log({
                    message: 'Get tables from service',
                    table: table.table_name
                });
                return table.table_name;
            });
            console.log('Table names to return:', tableNames);
            return tableNames;
            }).catch(error => {
                    console.error('Error fetching tables', error);
                    queryRunner.release();
                    throw error;
            }));
        }

        
            async findAll(): Promise<Order[]> {
                console.log(`find all orders ${ await this.orderRepository.find()}`);
                
                return this.orderRepository.find();
            }
        
}
