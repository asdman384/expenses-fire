import { Component } from '@angular/core';
import { UserExpense } from 'src/models/expense-info';
import { Database } from 'src/services/database';

@Component({
    selector: 'main-screen',
    templateUrl: './main-screen.component.html',
    styleUrls: ['./main-screen.component.css']
})
export class MainScreenComponent {

    loading: boolean = false;

    constructor(
        private database: Database
    ) { }

    addExpenseForm_onAddClick(expenseInfo: UserExpense) {
        this.loading = true;
        this.database.addExpense(expenseInfo).then(_ => this.loading = false);
    }
}