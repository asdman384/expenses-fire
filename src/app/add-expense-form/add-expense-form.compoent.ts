import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { CategoryInfo } from 'src/models/category-info';
import { UserExpense } from 'src/models/expense-info';
import { UserSetting } from 'src/models/users-setting';
import { Database } from 'src/services/database';
import { map } from 'rxjs/operators';
import { Helper } from 'src/helpers/helper';

@Component({
    selector: 'add-expense-form',
    templateUrl: './add-expense-form.compoent.html',
    styleUrls: ['./add-expense-form.compoent.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddExpenseFormComponent implements OnInit {

    value: UserExpense = new UserExpense();
    @Output() onAddClick = new EventEmitter<UserExpense>();
    @Output() onUserChanged = new EventEmitter<string>();
    @Output() onDateChanged = new EventEmitter<Date>();

    categories: Observable<CategoryInfo[]>;
    userSettings: Observable<UserSetting[]>;

    constructor(
        public afAuth: AngularFireAuth,
        private database: Database
    ) { }

    ngOnInit(): void {
        this.afAuth.authState.subscribe((user: firebase.User) => {
            if (!user)
                return;

            this.reset();
            this.categories = this.database.getAllCategories()
                .pipe(map(categories => categories.sort(Helper.sortBy('priority', 'asc'))));
            this.userSettings = this.database.getAllUserSettings();
        });
    }

    onButtonAddClick() {
        this.onAddClick.emit(this.value);
        this.reset();
    }

    private reset() {
        this.value = new UserExpense();
        this.value.expense.date = new Date();
        this.value.userId = this.afAuth.auth.currentUser.uid;
    }
}