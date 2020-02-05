import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Helper } from 'src/helpers/helper';
import { ExpenseNcategory } from 'src/models/expense-info';
import { UserSetting } from 'src/models/users-setting';
import { Database } from 'src/services/database';

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

    userSettings: Observable<UserSetting[]>;
    yearSelectDataSource = Array.from({ length: new Date().getFullYear() - 2018 }, (v, i) => 2019 + i);
    dataSource: BehaviorSubject<ExpenseNcategory[]> = new BehaviorSubject<ExpenseNcategory[]>([]);

    columnsToDisplay: string[] = ['category', 'amount'];
    data: ExpenseNcategory[];

    constructor(
        public afAuth: AngularFireAuth,
        public database: Database,
    ) { }

    ngOnInit(): void {

        combineLatest(this.monthSelect.valueChanges, this.yearSelect.valueChanges, this.userSelect.valueChanges)
            .pipe(switchMap(([month, year, userId]) => this.database.getMonthExpenses(+month, year, userId)))
            .subscribe(data => {
                this.data = data;
                this.dataSource.next(
                    Helper.reduceByCategory(data).sort(Helper.sortBy('amount')));
            });

        this.afAuth.authState.subscribe((user: firebase.User) => {
            if (!user)
                return;

            this.userSettings = this.database.getAllUserSettings();
            this.userSelect.setValue(user.uid);
            this.monthSelect.setValue(new Date().getMonth() + '');
            this.yearSelect.setValue(new Date().getFullYear() + '');
        })

    }


    calculateTotal(expense: ExpenseNcategory[]) {
        return expense.map(e => e.amount).reduce((p, c) => p + c, 0);
    }
}
