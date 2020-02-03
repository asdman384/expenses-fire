export class UserExpense {

    constructor() {
        this.expense = new Expense();
    }

    userId: string;
    expense: Expense
}

export class Expense {
    id?: string;
    date: Date;
    amount: number;
    catId: string;
    comm?: string;
}

export class ExpenseDto {
    id?: string;
    date: firebase.firestore.Timestamp;
    amount: number;
    catId: string;
    comm?: string;
}