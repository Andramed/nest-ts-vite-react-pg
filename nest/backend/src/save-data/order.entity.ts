// src/save-data/order.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    orderId: string;

    @Column()
    clientOrderId: string;

    @Column()
    symbol: string;

    @Column()
    side: string;

    @Column()
    type: string;

    @Column('decimal', { precision: 20, scale: 8 })
    price: number;

    @Column('decimal', { precision: 20, scale: 8 })
    quantity: number;

    @Column()
    status: string;

    @Column({ type: 'timestamp' })
    timestamp: Date;

    @Column({ type: 'timestamp' })
    transactionTime: Date;
}
