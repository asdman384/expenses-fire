import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, QueryFn, CollectionReference } from '@angular/fire/firestore';
import { firestore } from 'firebase/app';
import { Observable } from 'rxjs';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';
import { map } from 'rxjs/operators';
import { CategoryDto, CategoryInfo } from 'src/models/category-info';
import { Expense, ExpenseDto, ExpenseNcategory, UserExpense } from 'src/models/expense-info';
import { UserSetting } from 'src/models/users-setting';

@Injectable({
    providedIn: 'root'
})
export class Database {

    private expTableSuffix = 'exps-';
    private categoriesTable = 'categories';

    public static dateQueryFn = (date: Date): QueryFn =>
        (ref: CollectionReference) => ref
            .where('date', '>=', firestore.Timestamp.fromMillis(date.setHours(0, 0, 0, 0)))
            .where('date', '<=', firestore.Timestamp.fromMillis(date.setHours(23, 59, 59, 999)));

    public static toMonthQueryFn: QueryFn = ref => {
        let current = new Date();

        let start = new Date();
        start.setMonth(current.getMonth(), 1);

        let end = new Date();
        end.setMonth(current.getMonth() + 1, 0);
        return ref
            .where('date', '>=', firestore.Timestamp.fromMillis(start.setHours(0, 0, 0, 0)))
            .where('date', '<=', firestore.Timestamp.fromMillis(end.setHours(23, 59, 59, 999)));
    };

    constructor(
        private fireStore: AngularFirestore,
        private afAuth: AngularFireAuth
    ) { }

    public addExpense(userExpense: UserExpense): Promise<any> {
        return this.fireStore
            .collection(this.expTableSuffix + userExpense.userId)
            .add(ExpenseConverter.toFirestore(userExpense.expense));
    }

    public deleteExpense(id: string, userId?: string): Promise<void> {
        let table = this.expTableSuffix + (userId || this.afAuth.auth.currentUser.uid);

        return this.fireStore.collection(table).doc(id).delete();
    }

    public getExpenses(queryFn?: QueryFn, userId?: string): Observable<Expense[]> {
        let table = this.expTableSuffix + (userId || this.afAuth.auth.currentUser.uid);

        return this.fireStore.collection<ExpenseDto>(table, queryFn)
            .valueChanges({ idField: 'id' })
            .pipe(map(dto => dto.map(ExpenseConverter.fromFirestore)));
    }

    public getExpensesNcategory(queryFn?: QueryFn, userId?: string): Observable<ExpenseNcategory[]> {

        return combineLatest(
            this.getExpenses(queryFn, userId),
            this.getAllCategoriesMap()
        )
            .pipe(map(this.expenseCategoryMaper));
    }

    private expenseCategoryMaper([expenses, catMap]: [Expense[], Map<string, CategoryInfo>]): ExpenseNcategory[] {
        return expenses
            .reverse()
            .map((e: Expense) =>
                ({ ...e, categoryName: catMap.has(e.catId) ? catMap.get(e.catId).name : e.catId }));
    }

    public getMonthExpenses(month: number, y?: number, userId?: string): Observable<ExpenseNcategory[]> {
        let start = new Date(),
            end = new Date(),
            year = y || new Date().getFullYear();

        start.setMonth(month, 1);
        start.setFullYear(year);
        end.setMonth(month + 1, 0);
        end.setFullYear(year);

        let monthQuery: QueryFn = ref => ref
            .where('date', '>=', firestore.Timestamp.fromMillis(start.setHours(0, 0, 0, 0)))
            .where('date', '<=', firestore.Timestamp.fromMillis(end.setHours(23, 59, 59, 999)));

        return this.getExpensesNcategory(monthQuery, userId);
    }

    public addCategory(category: CategoryInfo) {
        return this.fireStore
            .collection<CategoryInfo>(this.categoriesTable)
            .doc<CategoryDto>(category.id)
            .set({
                name: category.name,
                priority: category.priority
            });
    }

    delteCategory(id: string) {
        return this.fireStore.collection(this.categoriesTable).doc(id).delete();
    }

    public getAllCategories(): Observable<CategoryInfo[]> {
        return this.fireStore
            .collection<CategoryInfo>(this.categoriesTable)
            .valueChanges({ idField: 'id' });
    }

    public getAllCategoriesMap(): Observable<Map<string, CategoryInfo>> {
        let setReducer = (p: Map<string, CategoryInfo>, c: CategoryInfo) => { p.set(c.id, c); return p; };

        return this.getAllCategories()
            .pipe(map(docs => docs.reduce(setReducer, new Map<string, CategoryInfo>())));
    }

    public getAllUserSettings(): Observable<UserSetting[]> {
        return this.fireStore
            .collection<UserSetting>('users-settings')
            .valueChanges({ idField: 'userId' });
    }

    public createUserSettingIfNotExist(uid: string, displayName: string, email: string) {
        this.fireStore
            .collection('users-settings')
            .doc(uid).get()
            .subscribe(document => {
                if (document.exists)
                    return;

                document.ref.set({ displayName, email });
            });
    }


}

const ExpenseConverter = {
    toFirestore: function (expenseInfo: Expense): ExpenseDto {
        let expenseDto = {
            date: firestore.Timestamp.fromDate(expenseInfo.date),
            amount: expenseInfo.amount,
            catId: expenseInfo.catId,
        };

        if (expenseInfo.comm)
            expenseDto['comm'] = expenseInfo.comm;

        return expenseDto;
    },

    fromFirestore: function (data: ExpenseDto): Expense {
        let expense = new Expense();
        expense.id = data.id;
        expense.date = data.date.toDate();
        expense.catId = data.catId;
        expense.amount = data.amount;
        if (data.comm)
            expense.comm = data.comm;

        return expense;
    }
};