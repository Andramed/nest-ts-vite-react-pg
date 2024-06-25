import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { Repository } from 'typeorm';
import { Observable, catchError, from, map, mergeMap, reduce, toArray } from 'rxjs';

interface SaveOrdersResult {
    savedOrders: Order[];
    failedOrders: { order: Order, error: any }[];
}

@Injectable()
export class SaveDataService {
    constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>
    ){}

    saveOrders(orders: Order[]): Observable<SaveOrdersResult> {
        return from(orders).pipe(
            mergeMap(order =>
                from(this.orderRepository.save(order)).pipe(
                    map(savedOrder => ({ order: savedOrder, error: null })), // Return the saved order
                    catchError(err => {
                       
                        return from([{ order, error: err }]); // Return the order and error
                    })
                )
            ),
            reduce((acc, result) => {
                if (result.error) {
                    acc.failedOrders.push(result);
                } else {
                    acc.savedOrders.push(result.order);
                }
                return acc;
            }, { savedOrders: [], failedOrders: [] } as SaveOrdersResult)
        );
    }
}
