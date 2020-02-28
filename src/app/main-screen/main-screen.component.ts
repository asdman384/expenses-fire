import { Component, OnInit } from '@angular/core';
import { UserExpense, ExpenseNcategory } from 'src/models/expense-info';
import { Database } from 'src/services/database';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { filter, switchMap, map } from 'rxjs/operators';
import { QueryFn } from '@angular/fire/firestore';
import { MatRadioChange } from '@angular/material/radio';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'main-screen',
    templateUrl: './main-screen.component.html',
    styleUrls: ['./main-screen.component.css'],
    providers: [DatePipe]
})
export class MainScreenComponent implements OnInit {

    radioGroupValue = 'today';
    dateLabel: string = 'Today';
    adding: boolean = false;
    historyLoading: boolean = false;
    historyDataSource: Observable<ExpenseNcategory[]>;
    private userIdSubject = new BehaviorSubject<string>(null);
    private queryFnSubject = new BehaviorSubject<QueryFn>(Database.dateQueryFn(new Date()));

    constructor(
        private afAuth: AngularFireAuth,
        private database: Database,
        private datePipe: DatePipe
    ) { }

    ngOnInit(): void {
        this.historyDataSource = combineLatest(
            this.afAuth.user,
            this.queryFnSubject,
            this.userIdSubject
        ).pipe(
            filter(([user, queryFn, userId]) => !!user),
            switchMap(([user, queryFn, userId]) => {
                this.historyLoading = true;
                return this.database.getExpensesNcategory(queryFn, userId);
            }),
            map(data => {
                this.historyLoading = false;
                return data;
            }));
    }

    intervalRadioGroupChange(change: MatRadioChange) {
        this.queryFnSubject.next(
            change.value === 'today' ? Database.dateQueryFn(new Date()) : Database.toMonthQueryFn);
    }

    addExpenseForm_onAddClick(expenseInfo: UserExpense) {
        this.adding = true;
        this.database.addExpense(expenseInfo).then(_ => this.adding = false);
    }

    addExpenseForm_onUserChanged(userId: string) {
        this.userIdSubject.next(userId);
    }

    addExpenseForm_onDateChanged(date: Date) {
        this.radioGroupValue = 'today';
        let isToday = date.toDateString() === new Date().toDateString();
        this.dateLabel = isToday ? 'Today' : this.datePipe.transform(date, 'M/dd/yyyy');
        this.queryFnSubject.next(Database.dateQueryFn(date));
    }
}