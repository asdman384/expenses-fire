import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormControl } from '@angular/forms';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';
import { distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Helper } from 'src/helpers/helper';
import { ExpenseNcategory } from 'src/models/expense-info';
import { UserSetting } from 'src/models/users-setting';
import { Database } from 'src/services/database';
import { Observable, BehaviorSubject } from 'rxjs';

@Component({
    selector: 'stats',
    templateUrl: './stats.component.html',
    styleUrls: ['./stats.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatsComponent implements OnInit {

    monthSelect = new FormControl();
    yearSelect = new FormControl();
    userSelect = new FormControl();

    yearSelectDataSource = Array.from({ length: new Date().getFullYear() - 2018 }, (v, i) => 2019 + i);
    dataSource: BehaviorSubject<ExpenseNcategory[]> = new BehaviorSubject<ExpenseNcategory[]>([]);

    columnsToDisplay: string[] = ['category', 'amount'];

    aggregator$ =
        new BehaviorSubject<ExpenseAggregator>(data => Helper.reduceByCategory(data).sort(Helper.sortBy('amount')));

    userSettings: Observable<UserSetting[]>;

    constructor(
        public afAuth: AngularFireAuth,
        public database: Database,
    ) { }

    ngOnInit(): void {
        let expenses$: Observable<ExpenseNcategory[]> =
            combineLatest(
                this.monthSelect.valueChanges,
                this.yearSelect.valueChanges,
                this.userSelect.valueChanges)
                .pipe(
                    distinctUntilChanged(),
                    switchMap(([month, year, userId]) => this.database.getMonthExpenses(+month, year, userId))
                );

        combineLatest(expenses$, this.aggregator$)
            .subscribe(([expenses, aggregator]) =>
                this.dataSource.next(aggregator(expenses)));

        this.afAuth.authState.subscribe((user: firebase.User) => {
            if (!user)
                return;

            this.userSettings = this.database.getAllUserSettings();
            this.userSelect.setValue(user.uid);
            this.monthSelect.setValue(new Date().getMonth() + '');
            this.yearSelect.setValue(new Date().getFullYear() + '');
        });

    }

    categoryRowClick(row: ExpenseNcategory) {
        this.aggregator$.next(expenses =>
            Helper.groupBy<ExpenseNcategory>(expenses, 'catId')[row.catId].sort(Helper.sortBy('amount')));

        this.columnsToDisplay = ['date', 'amount', 'comment'];
    }

    clickBack() {
        this.aggregator$.next(expenses =>
            Helper.reduceByCategory(expenses).sort(Helper.sortBy('amount')));

        this.columnsToDisplay = ['category', 'amount'];
    }

    calculateTotal(expense: ExpenseNcategory[]) {
        return expense.map(e => e.amount).reduce((p, c) => p + c, 0);
    }

    dateTotal(data: ExpenseNcategory[]) {
        return data[0].categoryName;
    }
}

type ExpenseAggregator = (expenses: ExpenseNcategory[]) => ExpenseNcategory[];