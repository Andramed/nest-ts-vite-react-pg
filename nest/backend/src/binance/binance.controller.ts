import { Controller, Get } from '@nestjs/common';
import { FetchDataService } from './fetch-data/fetch-data.service';

@Controller('binance')
export class BinanceController {
    constructor(
        private readonly fetchDataService: FetchDataService
    ){}

    @Get()
    fetcData() {
        console.log("Get fetched data");
        return this.fetchDataService.getOrderFromCustomPeriod();
    }
}
