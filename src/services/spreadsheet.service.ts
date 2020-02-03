import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SpreadsheetService {

    constructor(private http: HttpClient) { }

    add(token: string, name: string, amount: number, category: string, comment: string): Observable<Response<SheetData[]>> {
        return this.http.jsonp<Response<SheetData[]>>(
            `https://script.google.com/macros/s/${token}/exec?action=add&name=${name}&amount=${amount}&category=${category}&comment=${comment}`, 'callback');
    }

    getCategories(token: string): Observable<Response<string[]>> {
        return this.http.jsonp<Response<string[]>>(
            `https://script.google.com/macros/s/${token}/exec?action=getcategories`, 'callback');
    }

    getMonthData(token: string, user: string, month: number): Observable<Response<SheetData[]>> {
        return this.http.jsonp<Response<SheetData[]>>(
            `https://script.google.com/macros/s/${token}/exec?action=getMonthData&name=${user}&month=${month}`, 'callback');
    }

    getAllData(token: string, user: string): Observable<Response<SheetData[]>> {
        return this.http.jsonp<Response<SheetData[]>>(
            `https://script.google.com/macros/s/${token}/exec?action=getAllData&name=${user}`, 'callback');
    }
}

export class Response<TResult> {
    status: string;
    result: TResult;
}


export type SheetData = [string, number, string, string]; // [date, amount, category, comment]


function exportFunct() {

    var cats = {
        'Нямка': '1',
        'Продукты': '2',
        'Транспорт': '3',
        'Обед': '4',
        'Ресторан': '5',
        'Хозтовары': '6',
        'Одежда': '7',
        'Аренда': '8',
        'Подарки': '9',
        'Медикаменты': '10',
        'Медицина': '11',
        'Косметика': '12',
        'Поездки': '13',
        'Бижутерия': '14',
        'Покупки (разное)': '15',
        'Родителям': '16',
        'Абонплата(моб/интернет)': '17',
    }

    this.spreadsheetService
        .getAllData('', '')
        .subscribe(data => {

            var i = 1;
            var sendExp = () => {
                let [date, amount, category, description] = data.result.pop();
                console.log(date, i++);
                if (date) {
                    if (date == 'Date') {
                        sendExp();
                        return;
                    }
                    this.database.addExpense({
                        userId: 'ZgcSLkyedaSGdx7HdNB3HsIhVkx1',
                        expense: {
                            date: new Date(date),
                            amount,
                            catId: cats[category],
                            comm: description
                        }
                    }).then(sendExp).catch(console.warn);
                }
            }


            sendExp();
        });
}