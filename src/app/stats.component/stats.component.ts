import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Database } from 'src/services/database';
import { switchMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserSetting } from 'src/models/users-setting';
import { Observable, combineLatest, BehaviorSubject } from 'rxjs';
import { Expense } from 'src/models/expense-info';

@Component({
    selector: 'stats',
    templateUrl: './stats.component.html',
    styleUrls: ['./stats.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatsComponent implements OnInit {

    monthSelect = new FormControl();
    yearSelect = new FormControl(new Date().getFullYear() + '');
    userSelect = new FormControl();
    userSettings: Observable<UserSetting[]>;
    yearSelectDataSource = Array.from({ length: new Date().getFullYear() - 2018 }, (v, i) => 2019 + i);
    dataSource: BehaviorSubject<Expense[]> = new BehaviorSubject<Expense[]>([]);
    columnsToDisplay: string[] = ['category', 'amount'];
    data: Expense[];

    constructor(
        public afAuth: AngularFireAuth,
        public database: Database,
    ) { }

    ngOnInit(): void {

        combineLatest(this.monthSelect.valueChanges, this.userSelect.valueChanges)
            .pipe(switchMap(([month, userId]) => this.database.getMonthExpenses(+month, userId)))
            .subscribe(data => {
                this.data = data;
                this.dataSource.next(
                    Reducers.reduceByCategory(data).sort(Reducers.sortBy('amount')));
            });

        this.afAuth.authState.subscribe((user: firebase.User) => {
            if (!user)
                return;

            this.userSettings = this.database.getAllUserSettings();
            this.userSelect.setValue(user.uid);
            this.monthSelect.setValue(new Date().getMonth() + '');
        })

    }


    calculateTotal(expense: Expense[]) {
        return expense.map(e => e.amount).reduce((p, c) => p + c, 0);
    }
}


class Reducers {

    public static sortBy(field: string) {
        return function (a, b) { return b[field] - a[field] }
    }

    public static reduceByCategory(dataSet: Expense[]): Expense[] {
        if (!dataSet)
            return [];

        var result = new Array<Expense>();
        var data = dataSet.reduce((p, c: Expense) => {
            p.set(c.catId, p.has(c.catId) ? c.amount + p.get(c.catId) : c.amount); return p;
        }, new Map<string, number>());

        data.forEach((val, key) => result.push({ catId: key, amount: val, date: null }))
        return result;
    }
}