import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SaveDataService {
    constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>
    ){}

    async saveOrders(orders: Order[]): Promise<Order[]> {
        return this.orderRepository.save(orders);
    }
}
