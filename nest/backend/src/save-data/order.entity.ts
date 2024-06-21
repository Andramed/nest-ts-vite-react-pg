import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('order')
export class Order {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({unique: true})
    orderNumber: string;

    @Column()
    advNo: string;

    @Column()
    tradeType: string;

    @Column()
    asset: string;

    @Column()
    fiat: string;

    @Column()
    fiatSymbol: string;

    @Column()
    amount: string;

    @Column()
    totalPrice: string;

    @Column()
    unitPrice: string;

    @Column()
    orderStatus: string;

    @Column({type: "bigint"})
    createTime: number;

    @Column()
    commission: string;

    @Column()
    takerCommissionRate: string;

    @Column()
    takerCommission: string;

    @Column()
    takerAmount: string;

    @Column()
    counterPartNickName: string;

    @Column({default: "will be aded"})
    advertisementRole: string;

    @Column()
    additionalKycVerify: number;

	// @Column()
	// imageUrl?: string;

    

    // No need to add imageUrl property as it's not present in the order object
}
