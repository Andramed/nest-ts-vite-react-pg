import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac } from 'crypto';
import { Observable, catchError, map, throwError } from 'rxjs';

@Injectable()
export class FetchDataService {
    API_URL:string = this.configService.get<string>('URL');
    API_KEY:string = this.configService.get<string>('API_KEY');
    SECRET_KEY:string = this.configService.get<string>('SECRET_KEY');
    RECWINDOW:number = 10000;
    TM:any = Math.floor(Date.now());
    //year to create to add custom due we need to obtaine data from diferit year
    constructor(
        private configService: ConfigService,
        private httpService: HttpService
    ){}

    transformDateInEchoFormat = (date: string): number => {
        const elementeData = date.split(" ");
        const dataFormatUTC = new Date(`${elementeData[0].split("-").reverse().join("-")}T${elementeData[1]}:00`);
        return dataFormatUTC.getTime();
    };

    getOrderFromCustomPeriod(): Observable<any>{
        let startDate = this.transformDateInEchoFormat("02-02-2024 00:00");
        let endDate = this.transformDateInEchoFormat("02-02-2024 00:00");
        let QUERY = `recvWindow=${this.RECWINDOW}&timestamp=${this.TM}&startTimestamp=${startDate}&endTimestamp=${endDate}`;
        const SIGNATURE = createHmac('sha256', this.SECRET_KEY).update(QUERY).digest('hex');
        const url:string = `${this.API_URL}?${QUERY}&signature=${SIGNATURE}`
        
        return this.httpService.get(url, {
            headers: { 'X-MBX-APIKEY': this.API_KEY },
          }).pipe(
            map(response => response.data),
            catchError(error => {
              console.error({
                message: "We have an error when we try to fetch data from custom fetch",
                error: error.message,
              });
              return throwError(() => new Error('Failed to fetch data from Binance API'));
            })
          );
    }
    
}
