import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-calculator',
    templateUrl: './calculator.component.html',
    styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent {

    value: string = '';

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: BehaviorSubject<string>
    ) { }

    input(data) {

        if (data === 'clear')
            this.value = '';
        else
            this.value += data;

        try {
            var result = eval(this.value) || '';
        } catch (error) {
            return;
        }

        this.data.next(result);

    }

}
