import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { log } from 'console';
import { createHmac } from 'crypto';
import * as moment from 'moment';
import { tap } from 'node:test/reporters';
import { Observable, catchError, concatMap, expand, from, map, of, reduce, switchMap, throwError, lastValueFrom, mergeMap } from 'rxjs';

@Injectable()
export class FetchDataService {
    
    API_URL: string = this.configService.get<string>('URL');
    API_KEY: string = this.configService.get<string>('API_KEY');
    SECRET_KEY: string = this.configService.get<string>('SECRET_KEY');
    RECWINDOW: number = 10000;
    ROW_NUMBER: number = 10;

    constructor(
        private configService: ConfigService,
        private httpService: HttpService
    ) {}

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
    private transformDateInEchoFormat(dateString: string): number {
        return moment(dateString, "DD-MM-YYYY HH:mm").valueOf();
    }
    getData(startDate: string, endDate: string): Observable<any> {
        const startTimestamp = this.transformDateInEchoFormat(startDate);
        const endTimestamp = this.transformDateInEchoFormat(endDate);
        let page = 1;

       

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
                        return res.data;
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
                        return of([]);
                    }),
                );
            })
        );
    }

    
    getDataForMonths(): Observable<any> {
        const startOfTheYear = moment().startOf('year');
        const months = [];

        for (let month = 0; month < 12; month++) {
            const start = startOfTheYear.clone().add(month, 'months').startOf('month').format("DD-MM-YYYY HH:mm:ss");
            const end = startOfTheYear.clone().add(month, 'months').endOf('month').format("DD-MM-YYYY HH:mm:ss");
            months.push({ start, end });
        }

        return from(months).pipe(
            mergeMap(month => {
                return this.getData(month.start, month.end).pipe(
                    map(data => ({
                        month: month.start,
                        orders: data.data,
                        total: data.total,
                        start: month.start,
                        end: month.end
                    }))
                );
            })
        );
    }

    getDetailedListOfOrder() {

    }

}
