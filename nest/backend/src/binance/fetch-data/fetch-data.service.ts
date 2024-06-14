import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac } from 'crypto';
import * as moment from 'moment';
import { start } from 'repl';
import { Observable, catchError, switchMap, map, expand, of, throwError, lastValueFrom, from, concatMap } from 'rxjs';

@Injectable()
export class FetchDataService {
    private dataAccumulator: any[] = [];  // Array pentru a stoca datele acumulate

    API_URL: string = this.configService.get<string>('URL');
    API_KEY: string = this.configService.get<string>('API_KEY');
    SECRET_KEY: string = this.configService.get<string>('SECRET_KEY');
    RECWINDOW: number = 10000;
    ROW_NUMBER: number = 40;

    constructor(
        private configService: ConfigService,
        private httpService: HttpService
    ) {}

    private transformDateInEchoFormat(dateString: string): number {
        return moment(dateString, "DD-MM-YYYY HH:mm").valueOf();
    }

    private getTimeStamp(): Observable<number> {
        const URL_TIMESTAMP = this.configService.get("URL_TIMESTAMP");
        return this.httpService.get(URL_TIMESTAMP).pipe(
            map(response => response.data.serverTime),
            catchError(err => {
                console.error('Error fetching server time:', err.message);
                return throwError(() => new Error('Failed to fetch server time from Binance API'));
            })
        );
    }

    getData( ): Observable<any> {
        const startDate = "01-02-2024 00:00";
        const endDate = "04-02-2024 23:59"
        const startTimestamp = this.transformDateInEchoFormat(startDate);
        const endTimestamp = this.transformDateInEchoFormat(endDate);
        let page = 1
        return this.getTimeStamp().pipe(
            switchMap(timeStamp => {
                let QUERY = `recvWindow=${this.RECWINDOW}&timestamp=${timeStamp}&startTimestamp=${startTimestamp}&endTimestamp=${endTimestamp}&rows=${this.ROW_NUMBER}&page=${page}`; 
                const SIGNATURE = createHmac('sha256', this.SECRET_KEY).update(QUERY).digest('hex');
                const url: string = `${this.API_URL}?${QUERY}&signature=${SIGNATURE}`;

                return this.httpService.get<any>(url, {
                    headers: { 'X-MBX-APIKEY': this.API_KEY }
                }).pipe(
                    map(res => {
                        if (!res.data || !Array.isArray(res.data.data)) {
                            throw new Error('Invalid API response');
                        }

                        console.log({
                            message: `Data fetched for page ${page}`,
                            start: startDate,
                            end: endDate,
                            total: res.data.data.length,
                            response: res.data,
                            url
                        });

                       return res.data.data

                        
                    }),
                    catchError(err => {
                        console.error({
                            message: "We have an error when we try to fetch data from custom fetch",
                            error: err.message,
                            stack: err.stack,
                            config: err.config,
                            response: err.response ? {
                                data: err.response.data,
                                status: err.response.status,
                                headers: err.response.headers
                            } : null
                        });
                        return throwError(() => new Error("Failed to fetch data from Binance API"));
                    }),
                    
                );
            })
        );
    }


}
