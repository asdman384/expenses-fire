import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { QueryFn } from '@angular/fire/firestore';
import { MatRadioChange } from '@angular/material';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { CategoryInfo } from 'src/models/category-info';
import { Expense } from 'src/models/expense-info';
import { Database } from 'src/services/database';

@Component({
    selector: 'history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

    dataSource: Observable<Expense[]>
    queryFnSubject = new BehaviorSubject<QueryFn>(Database.todayQueryFn)

    constructor(
        private database: Database,
    ) { }

    ngOnInit(): void {

        this.dataSource = this.queryFnSubject
            .pipe(
                switchMap(fn => this.database.getExpenses(fn)),
                map(data => data.reverse())
            );
    }

    intervalRadioGroupChange(change: MatRadioChange) {
        this.queryFnSubject.next(
            change.value === 'today' ? Database.todayQueryFn : Database.currentMonth);
    }

}

@Pipe({ name: 'categoryPipe' })
export class CategoryPipe implements PipeTransform {

    cat: Map<string, CategoryInfo> = new Map<string, CategoryInfo>();

    constructor(private database: Database) {
        console.log('categoryPipe constructor');

        this.database.getAllCategoriesOnce().subscribe(data => this.cat = data);
    }

    transform(catId: string): string {
        let category = this.cat.get(catId);
        if (category)
            return this.cat.get(catId).name;

        return 'unknown ' + catId;
    }
}