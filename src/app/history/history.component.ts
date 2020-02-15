import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { Observable } from 'rxjs';
import { ExpenseNcategory } from 'src/models/expense-info';
import { Database } from 'src/services/database';

@Component({
    selector: 'history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit, OnDestroy {

    @Input()
    dataSource: Observable<ExpenseNcategory[]>;

    private preventDocumentScroll: boolean = false;
    disableDrag: boolean = false;

    @ViewChild(MatTable, { static: true, read: ElementRef })
    matTable: ElementRef<HTMLTableElement>;

    constructor(
        private database: Database
    ) { }

    ngOnInit(): void {
        document.addEventListener('touchmove', this.docTouchmove, { passive: false });
        document.addEventListener('touchend', this.docTouchend, { passive: false });
    }

    private docTouchmove = (event: Event) => {
        if (this.preventDocumentScroll) {
            event.stopPropagation();
            event.preventDefault();
        }
        else {
            this.disableDrag = true;
        }
    };

    private docTouchend = (event: Event) => { this.disableDrag = false; };

    onMove(event: { shift: number, element: HTMLElement; }) {
        this.matTable.nativeElement.style.backgroundColor = 'rgba(255, 127, 80, 0.5)';
        if (event.shift > 100)
            this.matTable.nativeElement.style.backgroundColor = 'rgba(255, 127, 80, 1)';

        this.preventDocumentScroll = true;
    }

    onPutBack(event: { shift: number, element: HTMLElement; }, row: ExpenseNcategory) {
        this.matTable.nativeElement.style.backgroundColor = 'rgba(255, 127, 80, 0.5)';

        if (event.shift > 100)
            this.database.deleteExpense(row.id);

        this.preventDocumentScroll = false;
    }

    ngOnDestroy(): void {
        document.removeEventListener('touchmove', this.docTouchmove);
        document.removeEventListener('touchend', this.docTouchend);
    }
}