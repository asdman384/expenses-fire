import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { QueryFn } from '@angular/fire/firestore';
import { MatRadioChange } from '@angular/material';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { ExpenseNcategory } from 'src/models/expense-info';
import { Database } from 'src/services/database';

@Component({
    selector: 'history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

    dataSource: Observable<ExpenseNcategory[]>
    queryFnSubject = new BehaviorSubject<QueryFn>(Database.todayQueryFn)

    constructor(
        public afAuth: AngularFireAuth,
        private database: Database,
    ) { }

    ngOnInit(): void {
        this.afAuth.user.subscribe(_ => {
            this.dataSource = this.queryFnSubject
                .pipe(
                    filter(_ => !!this.afAuth.auth.currentUser),
                    switchMap(queryFn => this.database.getExpensesNcategory(queryFn)));
        })
    }

    intervalRadioGroupChange(change: MatRadioChange) {
        this.queryFnSubject.next(
            change.value === 'today' ? Database.todayQueryFn : Database.toMonthQueryFn);
    }

}