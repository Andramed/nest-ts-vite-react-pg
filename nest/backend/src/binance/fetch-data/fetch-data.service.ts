import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { createHmac } from 'crypto';
import * as moment from 'moment';
import { Observable, catchError, concatMap, expand, from, map, of, reduce, switchMap, throwError, lastValueFrom, mergeMap, forkJoin, defaultIfEmpty, tap } from 'rxjs';
import { Order } from 'src/save-data/order.entity';
import { SaveDataService } from 'src/save-data/save-data.service';
import { Repository } from 'typeorm';

interface pageResult {
    pageNumber: number;
    savedOrder: number;
    failedOrder: number;
}

@Injectable()
export class FetchDataService {
    
    API_URL: string = this.configService.get<string>('URL');
    API_KEY: string = this.configService.get<string>('API_KEY');
    SECRET_KEY: string = this.configService.get<string>('SECRET_KEY');
    RECWINDOW: number = 10000;
    ROW_NUMBER: number = 10;
    totalForYears: { [key: string]: any } = {}

    constructor(
        private configService: ConfigService,
        private httpService: HttpService,
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
        private saveDataService: SaveDataService
    ) {}

    private getTimeStamp(): Observable<number> {
        const URL_TIMESTAMP = this.configService.get("URL_TIMESTAMP");
        return this.httpService.get(URL_TIMESTAMP).pipe(
            map(response => {
                return response.data.serverTime
            }),
            catchError(err => {
                console.error('Error fetching server time:', err.message);
                return throwError(() => new Error('Failed to fetch server time from Binance API'));
            })
        );
    }

    private transformDateInEchoFormat(dateString: string): number {
        return moment(dateString, "DD-MM-YYYY HH:mm").valueOf();
    }
    
    getData(startDate: string, endDate: string, page:number =1): Observable<any> {
        const startTimestamp = this.transformDateInEchoFormat(startDate);
        const endTimestamp = this.transformDateInEchoFormat(endDate);
        return this.getTimeStamp().pipe(
            switchMap(timeStamp => { //la fiecare emitere de nou timestamp acesta anuleaza cel previous si face alta cerere
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
        for (let month = 0; month < 6; month++) {
            const start = startOfTheYear.clone().add(month, 'months').startOf('month').format("DD-MM-YYYY HH:mm:ss");
            const end = startOfTheYear.clone().add(month, 'months').endOf('month').format("DD-MM-YYYY HH:mm:ss");
            months.push({ start, end });
        }
        return from(months).pipe(
            mergeMap(month => {
                return this.getData(month.start, month.end).pipe(
                    map(data => {
                        const monthKey = `month${month.start}`;
                        this.totalForYears[monthKey] = {
                            total: data.total,
                            start: month.start,
                            end: month.end
                        };
                        return {
                            month: month.start,
                            orders: data.data,
                            total: data.total,
                            start: month.start,
                            end: month.end
                        }
                    })
                );
            })
        );
    }
   

    getDetailedListOfOrder(): Observable<any> {
        return this.getDataForMonths().pipe(
            mergeMap(monthData => {
                const { total, orders, end, start } = monthData;
                const pages = Math.ceil(total / this.ROW_NUMBER);
                const pageArray = Array.from({ length: pages }, (_, i) => i + 1);
                return from(pageArray).pipe(
                    mergeMap(page =>
                        this.getData(start, end, page).pipe(
                            mergeMap(data => 
                                this.saveDataService.saveOrders(data.data).pipe(
                                    map(saveResult => {
                                        return {
                                            page: page,
                                            savedOrders: saveResult.savedOrders.length,
                                            failedOrders: saveResult.failedOrders.length
                                        };
                                    }),
                                    catchError(err => {
                                        console.error({
                                            message: `Error saving data for page: ${page}`,
                                        });
                                        return of({
                                            page: page,
                                            savedOrders: 0,
                                            failedOrders: data.data.length,  // Assuming all failed
                                            message: `Error saving data for page: ${page}`
                                        });
                                    })
                                )
                            )
                        )
                    ),
                    reduce((acc, res) => {
                        acc[`page${res.page}`] = {
                            savedOrders: res.savedOrders,
                            failedOrders: res.failedOrders
                        };
                        return acc;
                    }, {} as { [key: string]: { savedOrders: number, failedOrders: number } })
                );
            })
        );
    }
    
    
    

    
    
}
 