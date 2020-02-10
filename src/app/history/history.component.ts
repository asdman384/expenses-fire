import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { QueryFn } from '@angular/fire/firestore';
import { MatRadioChange, MatTable } from '@angular/material';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { switchMap, filter } from 'rxjs/operators';
import { ExpenseNcategory } from 'src/models/expense-info';
import { Database } from 'src/services/database';

@Component({
    selector: 'history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit, OnDestroy {

    @Input() set userId(value) {
        this.userIdSubject.next(value);
    }

    disableDrag: boolean = false;
    dataSource: Observable<ExpenseNcategory[]>;
    private queryFnSubject = new BehaviorSubject<QueryFn>(Database.todayQueryFn);
    private userIdSubject = new BehaviorSubject<string>(null);
    private preventDocumentScroll: boolean = false;

    @ViewChild(MatTable, { static: true, read: ElementRef }) matTable: ElementRef<HTMLTableElement>;

    constructor(
        public afAuth: AngularFireAuth,
        private database: Database,
    ) { }

    ngOnInit(): void {
        document.addEventListener('touchmove', this.docTouchmove, { passive: false });
        document.addEventListener('touchend', this.docToucend, { passive: false });

        this.dataSource = combineLatest(
            this.afAuth.user,
            this.queryFnSubject,
            this.userIdSubject
        ).pipe(
            filter(([user, queryFn, userId]) => !!user),
            switchMap(([user, queryFn, userId]) => this.database.getExpensesNcategory(queryFn, userId)));
    }

    private docTouchmove = (event: Event) => {
        if (this.preventDocumentScroll) {
            event.stopPropagation();
            event.preventDefault();
        }
        else {
            this.disableDrag = true;
        }
    }

    private docToucend = (event: Event) => {
        this.disableDrag = false
    }

    intervalRadioGroupChange(change: MatRadioChange) {
        this.queryFnSubject.next(
            change.value === 'today' ? Database.todayQueryFn : Database.toMonthQueryFn);
    }

    onMove(event: { shift: number, element: HTMLElement }, row: ExpenseNcategory) {
        this.matTable.nativeElement.style.backgroundColor = 'rgba(255, 127, 80, 0.5)';
        if (event.shift > 100)
            this.matTable.nativeElement.style.backgroundColor = 'rgba(255, 127, 80, 1)';

        this.preventDocumentScroll = true;
    }

    onPutBack(event: { shift: number, element: HTMLElement }, row: ExpenseNcategory) {
        this.matTable.nativeElement.style.backgroundColor = 'rgba(255, 127, 80, 0.5)';

        if (event.shift > 100)
            this.database.deleteExpense(row.id)

        this.preventDocumentScroll = false;
    }

    ngOnDestroy(): void {
        document.removeEventListener('touchmove', this.docTouchmove)
        document.removeEventListener('touchend', this.docToucend);
    }
}