import { Controller, Get } from '@nestjs/common';
import { FetchDataService } from './fetch-data/fetch-data.service';
import { Observable, tap } from 'rxjs';

@Controller('binance')
export class BinanceController {
    constructor(
        private readonly fetchDataService: FetchDataService
    ){}

    @Get()
    getMonthData1(): Observable<any> {
        console.log("Fetching detailed list of orders");
        const observable = this.fetchDataService.getDetailedListOfOrder2()

        
        observable.subscribe(data => {
            console.log('Final result:', data);
        });

        return observable;
    }

   
    @Get()
        getMonthData(): Observable<any> {
            console.log("Fetching detailed list of orders");
            return this.fetchDataService.getDetailedListOfOrder2();
        }

}
