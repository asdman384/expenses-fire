import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { CategoryInfo } from 'src/models/category-info';
import { UserExpense } from 'src/models/expense-info';
import { UserSetting } from 'src/models/users-setting';
import { Database } from 'src/services/database';

@Component({
    selector: 'add-expense-form',
    templateUrl: './add-expense-form.compoent.html',
    styleUrls: ['./add-expense-form.compoent.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddExpenseFormComponent implements OnInit {

    value: UserExpense;
    @Output() onAddClick = new EventEmitter<UserExpense>();

    categories: Observable<CategoryInfo[]>;
    userSettings: Observable<UserSetting[]>;

    constructor(
        public afAuth: AngularFireAuth,
        private database: Database
    ) { }

    ngOnInit(): void {
        this.reset();
        this.afAuth.authState.subscribe((user: firebase.User) => {
            if (!user)
                return;

            this.categories = this.database.getAllCategories();
            this.userSettings = this.database.getAllUserSettings();
        })
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